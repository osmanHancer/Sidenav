import { Component, ViewEncapsulation } from '@angular/core';
import { QW } from '../../_lib/qw.helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pageMakale',
  standalone: true,
  imports: [],
  templateUrl: './makale.component.html',
  styleUrl: './makale.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PageMakaleComponent {
html: any;
name:any


constructor(private route: ActivatedRoute) {

}
async ngOnInit() {
  let makale= this.route.snapshot.paramMap.get('makale') 
  let html= await QW.json("/makale/"+makale);
  this.html=this.cleanThemesFromHtml(html.makale.metin);
  this.name=html.makale.seyahatnameadi


}


  async ngAfterViewInit(): Promise<void> {
  //  await this.loadScript("/assets/js/meykurt.js");
  }

  cleanThemesFromHtml(html: string): string {
    // RegEx ile 'tema-1', 'tema-2', ..., 'tema-5' sınıflarını kaldır
    return html.replace(/\btema-[1-5]\b/g, '').replace(/\s{2,}/g, ' ').trim();
  }
  
  public loadScript(url:string) {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById("script_omap")) return resolve();
      let node = document.createElement('script');
      node.src =url ;
      node.type = 'text/javascript';
      // node.id = "script_omap";
      node.async = false;
      node.onload = () => {
          resolve();
      };
      node.onerror = (error: any) => {
        reject();
      };
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }

}
