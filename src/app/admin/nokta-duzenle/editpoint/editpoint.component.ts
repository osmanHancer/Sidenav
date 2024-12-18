import { Component } from '@angular/core';
import { MySharedModules } from '../../../_com/myshared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { QW } from '../../../_lib/qw.helper';
@Component({
  selector: 'app-editpoint',
  standalone: true,
  imports: [MySharedModules],
  templateUrl: './editpoint.component.html',
  styleUrl: './editpoint.component.scss'
})
export class EditpointComponent {
  gizle: any;
  async submitForm(arg0: string) {
    const fd = new URLSearchParams();
   if(arg0=="update"){
   
    fd.append('id', this.editItem.id.toString());
    fd.append('yuzyil', this.editItem.yuzyil.toString());
    fd.append('seyahname_kodu', this.editItem.seyahname_kodu);
    fd.append('seyahatname_adi', this.editItem.seyahatname_adi);
    fd.append('bolum_chapter_mektupnumarasi', this.editItem.bolum_chapter_mektupnumarasi);
    fd.append('sayfa_numarasi', this.editItem.sayfa_numarasi.toString());
    fd.append('seyahat_adimi', this.editItem.seyahat_adimi.toString());
    fd.append('anlatida_gecen_mekan_adi', this.editItem.anlatida_gecen_mekan_adi);
    fd.append('mekanin_gunumuzdeki_adi', this.editItem.mekanin_gunumuzdeki_adi);
    fd.append('enlem', this.editItem.enlem.toString());
    fd.append('boylam', this.editItem.boylam.toString());
    fd.append('mekan_tipi', this.editItem.mekan_tipi);
    fd.append('konaklanma_durumu', this.editItem.konaklanma_durumu);
    fd.append('yapi_envanter_kodu', this.editItem.yapi_envanter_kodu);
    fd.append('alintilar', this.editItem.alintilar);
    fd.append('notlar', this.editItem.notlar);
    fd.append('rota_notlari', this.editItem.rota_notlari);
    fd.append('deniz_yoluyla_ulasim', this.editItem.deniz_yoluyla_ulasim);
    fd.append('tespit_edilen_konum_olcegi', this.editItem.tespit_edilen_konum_olcegi);
   await QW.jsonPost("/noktalar",fd);

   }
   if(arg0=="delete"){
   
    await QW.jsonPost("/noktalar/delete/"+this.editItem.id.toString()+"/"+ this.editItem.seyahname_kodu,fd);
   }
   await this.router.navigate(['/admin/point']);

  }
  editItem: edititem = {
    yuzyil: '', seyahname_kodu: '', yazar: '', seyahatname_adi: '', bolum_chapter_mektupnumarasi: '', sayfa_numarasi: NaN, seyahat_adimi: NaN, anlatida_gecen_mekan_adi: '', mekanin_gunumuzdeki_adi: '',
    enlem: 0.00000000, boylam: 0.000000000, tespit_edilen_konum_olcegi: '', mekan_tipi: '', konaklanma_durumu: '', yapi_envanter_kodu: '', alintilar: '', notlar: '', rota_notlari: '', deniz_yoluyla_ulasim: '',
  id:0,color:""};
  constructor(private route: ActivatedRoute,private router: Router) {


  }
  
  async ngOnInit() {
    const seyyahnameKodu = this.route.snapshot.paramMap.get('seyyahnameKodu') 
    const id = this.route.snapshot.paramMap.get('id')
    if(id !='-1'){
      this.gizle=false;
    let user_2 = await QW.json("/noktalar/"+seyyahnameKodu+"/"+id);
    this.editItem=user_2.data[0]
    }
    else{
      this.gizle=true;
    }


    }


}
type edititem = {


  yuzyil: string;


  seyahname_kodu: string;


  yazar: string;


  seyahatname_adi: string;


  bolum_chapter_mektupnumarasi: string;


  sayfa_numarasi: number;


  seyahat_adimi: number;


  anlatida_gecen_mekan_adi: string;


  mekanin_gunumuzdeki_adi: string;


  enlem: number;


  boylam: number;


  tespit_edilen_konum_olcegi: string;


  mekan_tipi: string;


  konaklanma_durumu: string;


  yapi_envanter_kodu: string;


  alintilar: string;


  notlar: string;


  rota_notlari: string;


  deniz_yoluyla_ulasim: string;

  id: number;

  color: string;
}