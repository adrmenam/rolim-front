import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import 'rxjs/add/operator/map';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable()

export class ProductsService {
  
  public currency : string = 'USD';
  public catalogMode : boolean = false;
  private privatebaseUrl:string = "http://198.199.69.76:3000/productos";
  //public productos : Product[]=[];
  
  public compareProducts : BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;

  // Initialize 
  constructor(private http: Http,private toastrService: ToastrService) { 
     this.compareProducts.subscribe(products => products = products);
  }

  // Observable Product Array
  private products(): Observable<Product[]> {
    let transaction = 
    {
      "transaccion": "generico",
      "tipo": "1"
    }
    var productos : Product[]=[];

    //Obtención de productos desde json en front
    //return this.http.get('assets/data/products.json').map((res:any) => res.json())
    //let aux = this.http.get('assets/data/products.json').map((res:any) => res.json())
    
    //Obtención de productos desde api rolim
    let aux = this.http.post(this.privatebaseUrl,transaction).map((res:any) => {
      console.log(res.json());
      console.log(res.json()['data'].length);
      
      for(var i=0;i<res.json()['data'].length;i++){
        
       let product : Product;
       product = {
         id: res.json()['data'][i]['id'],
         name: res.json()['data'][i]['descripcion'],
         price: res.json()['data'][i]['precio'],
         salePrice: res.json()['data'][i]['precio'],
         discount: 0,
         pictures: ["assets/images/laundry/product/"+ res.json()['data'][i]['imagen'] +".jpg"],
         shortDetails: res.json()['data'][i]['descripcion'],
         description: res.json()['data'][i]['descripcion'],
         stock: res.json()['data'][i]['estado']?1000:0,
         new: false,
         sale: false,
         category: "individual"
       }
       
       console.log(product);
       productos.push(product);
       console.log(productos);
      }
       console.log(productos);
      return productos;
      //return res.json();

    });
    console.log(aux);
    return aux;
     
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