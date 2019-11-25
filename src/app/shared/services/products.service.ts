import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { BehaviorSubject, Observable, of, Subscriber, forkJoin} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import 'rxjs/add/operator/map';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable()

export class ProductsService {
  
  public currency : string = 'USD';
  public catalogMode : boolean = false;
  private productsUrl:string = "http://198.199.69.76:3000/productos";
  private transactionProducts = {
    "transaccion": "generico",
    "tipo": "1"
  }

  private plansUrl:string = "http://198.199.69.76:3000/detallePlanes";
  private transactionPlans = {
    "transaccion": "consultarPlanes"
  }

  //public productos : Product[]=[];
  
  public compareProducts : BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;

  // Initialize 
  constructor(private http: Http,private toastrService: ToastrService) { 
     this.compareProducts.subscribe(products => products = products);
  }

  // Observable Product Array
  private products(): Observable<Product[]> {
    

    var productos : Product[]=[];
    var planes : Product[]=[];

    //Obtención de productos desde json en front
    //return this.http.get('assets/data/products.json').map((res:any) => res.json())
    //let aux = this.http.get('assets/data/products.json').map((res:any) => res.json())
    
    //Obtención de productos desde api rolim
    let auxProductos = this.http.post(this.productsUrl,this.transactionProducts).map((res:any) => {
      //console.log(res.json());
      //console.log(res.json()['data'].length);
      
      for(var i=0;i<res.json()['data'].length;i++){
        
       let product : Product;
       product = {
         id: res.json()['data'][i]['id'],
         name: res.json()['data'][i]['descripcion'],
         price: parseFloat(res.json()['data'][i]['precio']),
         salePrice: parseFloat(res.json()['data'][i]['precio']),
         discount: 0,
         pictures: ["assets/images/laundry/product/"+ res.json()['data'][i]['imagen'] +".jpg"],
         shortDetails: res.json()['data'][i]['descripcion'],
         description: res.json()['data'][i]['descripcion'],
         stock: res.json()['data'][i]['estado']?1000:0,
         new: false,
         sale: false,
         category: "individual"
       }
       
       //console.log(product);
       productos.push(product);
       //console.log(productos);
      }
      
      
      //console.log(productos);
      return productos;
      //return res.json();

    });

    let auxPlans = this.http.post(this.plansUrl,this.transactionPlans).map((res:any) => {
      //console.log(res.json());
      //console.log(res.json()['retorno'].length);
      
      for(var i=0;i<res.json()['retorno'].length;i++){
        
       let plan : Product;
       plan = {
         id: res.json()['retorno'][i]['plan'],
         name: res.json()['retorno'][i]['nombre'],
         price: parseFloat(res.json()['retorno'][i]['valor'].split("$")[1]),
         salePrice: parseFloat(res.json()['retorno'][i]['valor'].split("$")[1]),
         discount: 0,
         pictures: ["assets/images/laundry/product/"+ res.json()['retorno'][i]['icono']],
         shortDetails: res.json()['retorno'][i]['descripcion'],
         description: res.json()['retorno'][i]['descripcion'],
         stock: 1000,
         new: false,
         sale: false,
         category: "plan"
       }
       
       //console.log(product);
       planes.push(plan);
       //console.log(productos);
      }
      
      
      //console.log(planes);
      return planes;
      //return res.json();

    });

    
    return forkJoin(auxPlans, auxProductos).pipe(
      map(([plansArray, productsArray]) => plansArray.concat(productsArray))
    );

    //console.log(auxPlans);
    //return auxPlans;
     
    // return this.httpClient.post(this.baseUrl,transaction, {
    //   headers: new HttpHeaders({
    //        'Content-Type':  'application/json',
    //      })
    // }).map(data=>
    //  data);
  }

  // Get Products
  public getProducts(): Observable<Product[]> {
    return this.products();
  }

  // Get Products By Id
  public getProduct(id: number): Observable<Product> {
    return this.products().pipe(map(items => { return items.find((item: Product) => { return item.id === id; }); }));
  }

   // Get Products By category
  public getProductByCategory(category: string): Observable<Product[]> {
    return this.products().pipe(map(items => 
       items.filter((item: Product) => {
         if(category == 'all')
            return item
         else
            return item.category === category; 
        
       })
     ));
  }
  
   /*
      ---------------------------------------------
      ----------  Compare Product  ----------------
      ---------------------------------------------
   */

  // Get Compare Products
  public getComapreProducts(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Product): boolean {
    const item = products.find(item => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Product): Product | boolean {
    var item: Product | boolean = false;
    if (this.hasProduct(product)) {
      item = products.filter(item => item.id === product.id)[0];
      const index = products.indexOf(item);
    } else {
      if(products.length < 4)
        products.push(product);
      else 
        this.toastrService.warning('Maximum 4 products are in compare.'); // toasr services
    }
      localStorage.setItem("compareItem", JSON.stringify(products));
      return item;
  }

  // Removed Product
  public removeFromCompare(product: Product) {
    if (product === undefined) { return; }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem("compareItem", JSON.stringify(products));
  }
   
}