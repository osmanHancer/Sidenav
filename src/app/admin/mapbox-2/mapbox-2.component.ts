import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import allpoints from '../../../assets/19_james_morier_smooth_2.json';
import S29 from '../../../assets/S29-RP-DescEast.json';
import { MySharedModules } from '../../_com/myshared.module';
import { QW } from '../../_lib/qw.helper';
import { LayoutAdminComponent } from "../../_layoutadmin/layoutadmin.component";
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { LightgalleryModule } from 'lightgallery/angular';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageSliderModule } from 'ng-image-slider';
declare var turf: any;

@Component({
  selector: 'app-mapbox-2',
  standalone: true,
  templateUrl: './mapbox-2.component.html',
  styleUrls: ['./mapbox-2.component.scss'],
  imports: [CommonModule, RouterOutlet, MySharedModules, LayoutAdminComponent, LightgalleryModule, NgbPaginationModule, NgbAlertModule, NgImageSliderModule],
})
export class Mapbox2Component implements OnInit {
  CloseModal() {
    this.gizle = true;
  }

  public dialog = inject(MatDialog);
  map!: mapboxgl.Map;
  imagesslide: img[] = [];
  clickseyyahkod: any
  panelOpenState = false;
  visible = true;
  point_info_dialog: any = [];
  yuzyillar: any = [13, 14, 15, 16, 17, 18, 19];
  featureCollection: any = [];
  points: any[] = [];
  alintilar: any[] = [];
  maps_data: any;
  all_dialog_info: any[] = [];
  dialog_info_index: any;
  router: any;
  dialogImgs: any;
  play: any
  private animationFrameId: number | null = null;
  gizle: any
  dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5]
  ];

  line_animation_kod: any

  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

  settings = {
    counter: false,
    plugins: [lgZoom],
    interval: 100
  };

  mapsDataFilter(event: any) {

    this.maps_data = allpoints.filter((feature: any) =>
      feature.name_tr.toLowerCase().includes(event.target.value.toLowerCase())
    );


    this.yuzyillar = Array.from(
      new Set(
        this.maps_data
          .map((feature: any) => feature.crs.properties.yuzyil)
          .filter((yuzyil: any) => yuzyil !== undefined && yuzyil !== null)
      )
    ).sort((a: any, b: any) => a - b);

  }

  async ngOnInit() {



    this.maps_data = allpoints;
    this.gizle = true;
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: 6,

      center: [27.422222, 38.630554],
    });

    this.map.on('load', () => {

      this.map.loadImage(
        '../../../assets/icons/castle.png',
        (error, image: any) => {
          if (error) throw error;

          // Add the image to the map style.
          this.map.addImage('castle_1', image);
        });
      this.map.loadImage(
        '../../../assets/icons/houses.png',
        (error, image: any) => {
          if (error) throw error;

          // Add the image to the map style.
          this.map.addImage('houses', image);
        });

      this.maps_data.forEach((element: any) => {
        this.map.addSource(element.name, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: element.features,
          },
        });
      });
      this.maps_data.forEach((element: any) => {

        this.map.addLayer({
          id: element.name + 'kara',
          type: 'line',
          source: element.name,
          layout: {
            visibility: 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': element.crs.properties.color,
            'line-width': 3,
            'line-dasharray': [1, 0],
          },
          filter: ['==', 'tür', 'kara'],
        });

        this.map.addLayer({
          id: element.name + 'atlama',
          type: 'line',
          source: element.name,
          layout: {
            visibility: 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': element.crs.properties.color,
            'line-width': 3,
            'line-dasharray': [4, 3],
          },
          filter: ['==', 'tür', 'atlama'],
        });
        this.map.addLayer({
          id: element.name + 'deniz',
          type: 'line',
          source: element.name,
          layout: {
            visibility: 'none',
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': element.crs.properties.color,
            'line-width': 3,
            'line-dasharray': [4, 3],
          },
          filter: ['==', 'tür', 'deniz'],
        });

      });
    });
  }

  updateAllComplete(data: any) {

    if (this.map.getLayoutProperty(data + 'kara', 'visibility') == 'none') {
      this.DrawPoint(data);
      this.map.setLayoutProperty(data + 'deniz', 'visibility', 'visible');
      this.map.setLayoutProperty(data + 'kara', 'visibility', 'visible');
      this.map.setLayoutProperty(data + 'atlama', 'visibility', 'visible');

    } else {
      this.map.setLayoutProperty(data + 'deniz', 'visibility', 'none');
      this.map.setLayoutProperty(data + 'kara', 'visibility', 'none');
      this.map.setLayoutProperty(data + 'atlama', 'visibility', 'none');
      this.map.setLayoutProperty(data + 'heatmap', 'visibility', 'none');

      // this.map.setLayoutProperty(data+"dasharray", 'visibility', 'none');
      var location = [
        { point_type: 'YAPI', icon: 'castle_1', size: 2 },
        { point_type: 'YERLEŞİM YERİ', icon: 'houses', size: 0.1 },
        { point_type: 'YAKLAŞIK KONUM', icon: 'houses', size: 0.1 },
      ];
      location.forEach((c) => {
        this.map.removeLayer(data + c.point_type);
        this.map.off('click', data + c.point_type, this.onClickHandler);

      });
      this.map.removeLayer(data + 'heatmap');
      this.map.removeLayer(data + 'clusters');
      this.map.removeLayer(data + 'clusterstext');
      this.map.removeSource(data + 'point');
      this.map.removeSource(data + 'cluster');
    }
  }
  Heatmap(id: any) {


    var location = [
      { point_type: 'YAPI', icon: 'castle_1', size: 2 },
      { point_type: 'YERLEŞİM YERİ', icon: 'houses', size: 0.1 },
      { point_type: 'YAKLAŞIK KONUM', icon: 'houses', size: 0.1 },
    ];
    if (this.map.getLayoutProperty(id + 'heatmap', 'visibility') == 'none') {
      location.forEach((c) => {
        this.map.setLayoutProperty(id + c.point_type, 'visibility', 'none');

      });
      this.map.setLayoutProperty(id + 'heatmap', 'visibility', 'visible');
    }
    else {
      location.forEach((c) => {
        this.map.setLayoutProperty(id + c.point_type, 'visibility', 'visible');

      });
      this.map.setLayoutProperty(id + 'heatmap', 'visibility', 'none');
    }

  }
  Clustermap(id: any) {
    var location = [
      { point_type: 'YAPI', icon: 'castle_1', size: 2 },
      { point_type: 'YERLEŞİM YERİ', icon: 'houses', size: 0.1 },
      { point_type: 'YAKLAŞIK KONUM', icon: 'houses', size: 0.1 },
    ];
    if (this.map.getLayoutProperty(id + 'clusters', 'visibility') == 'none') {

      this.map.setLayoutProperty(id + 'clusters', 'visibility', 'visible');
      this.map.setLayoutProperty(id + 'clusterstext', 'visibility', 'visible');

    }
    else {

      this.map.setLayoutProperty(id + 'clusters', 'visibility', 'none');
      this.map.setLayoutProperty(id + 'clusterstext', 'visibility', 'none');
    }

  }
  async DrawPoint(SeyyahnameKod: string) {
    let seyyahallpoint = await QW.json('/noktalar/' + SeyyahnameKod);
    this.points.push(seyyahallpoint.data);

    this.pushFeatureCollectionPoint(this.featureCollection);
    this.map.addSource(SeyyahnameKod + 'point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.featureCollection,
      },
    });
    this.map.addSource(SeyyahnameKod + 'cluster', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.featureCollection,
      },
      cluster: true,
      clusterMaxZoom: 11, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    var location = [
      { point_type: 'YAPI', icon: 'castle_1', size: 2 },
      { point_type: 'YERLEŞİM YERİ', icon: 'houses', size: 0.1 },
      { point_type: 'YAKLAŞIK KONUM', icon: 'houses', size: 0.1 },
    ];
    location.forEach((c) => {
      this.map.addLayer({
        id: SeyyahnameKod + c.point_type,
        type: 'symbol',
        source: SeyyahnameKod + 'point',
        'layout': {
          'icon-image': c.icon, // reference the image
          'icon-size': c.size
        },

        filter: ['==', ['get', 'tespit_edilen_konum_olcegi'], c.point_type],
        minzoom: 6
      });

    });
    this.map.addLayer({
      id: SeyyahnameKod + 'clusters',
      type: 'circle',
      source: SeyyahnameKod + 'cluster',
      filter: ['has', 'point_count'],
      layout: { visibility: 'none' },
      paint: {

        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          50,
          1000,
          300,
          7500,
          400
        ]
      }
    });

    this.map.addLayer({
      id: SeyyahnameKod + 'clusterstext',
      type: 'symbol',
      source: SeyyahnameKod + 'cluster',
      filter: ['has', 'point_count'],
      layout: {
        visibility: 'none',
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    this.map.addLayer({
      id: SeyyahnameKod + "heatmap",
      type: 'heatmap',
      source: SeyyahnameKod + 'point',
      layout: { visibility: 'none' },
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'weight'],
          0,
          0,
          6,
          1,
        ],
        'heatmap-intensity': 1,
        'heatmap-radius': 33.8,
        'heatmap-opacity': 0.8,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(255, 255, 255, 0)', // Şeffaf
          0.2,
          'rgb(255, 204, 204)', // Açık kırmızı
          0.4,
          'rgb(255, 153, 153)', // Orta kırmızı
          0.6,
          'rgb(255, 102, 102)', // Koyu kırmızı
          0.8,
          'rgb(255, 0, 0)' // Tam kırmızı
        ],
      },


    });
    this.points = [];
    this.featureCollection = [];

    location.forEach((c) => {
      this.map.on('mouseenter', SeyyahnameKod + c.point_type, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', SeyyahnameKod + c.point_type, () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.clickseyyahkod = SeyyahnameKod;
      this.map.on('click', SeyyahnameKod + c.point_type, this.onClickHandler);
    });
  }

  pushFeatureCollectionPoint(featureCollection: any) {
    this.points.forEach((element: any) => {
      element.forEach((point: any) => {
        if (point.boylam != 0 || point.enlem != 0) {
          let data = [point.boylam, point.enlem];
          featureCollection.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: data,
            },
            properties: {
              Point_id: point.seyahname_kodu + ',' + point.id,
              tespit_edilen_konum_olcegi: point.tespit_edilen_konum_olcegi,
              seyahname_kodu: point.seyahname_kodu
            },
          });
        }
      });
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      panelClass: ["custom-dialog-container", "mat-mdc-dialog-actions"],
      width: '25%',
      height: 'auto',
      maxHeight: '100vh',
      maxWidth: '100vw',
      position: {
        right: '30px',
      },
      data: this.getDialogData()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined)
        this.gizle = true;
      else
        this.gizle = false;

    });

    dialogRef.keydownEvents().subscribe(async (event: { shiftKey: any; key: string }) => {

      if (event.key === 'ArrowRight') {
        this.imagesslide = [];
        this.alintilar = [];

        if (this.dialog_info_index != this.all_dialog_info.length - 1) {
          this.dialog_info_index = this.dialog_info_index + 1;

          console.log(this.all_dialog_info[this.dialog_info_index].enlem);
          if (this.all_dialog_info[this.dialog_info_index].enlem != 0) {
            if (this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu != "-") {
              this.point_info_dialog = await QW.json('/arazicalismasi/' + this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu);
              let lokasyonId = await QW.json('/lokasyon/getId/' + this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu);
              this.dialogImgs = await QW.json('/galeri/filter/' + lokasyonId.Id);
              this.dialogImgs = this.dialogImgs.images;
              this.dialogImgs.forEach((element: any) => {

                const newImage: img = {
                  image: 'http://localhost:3000/file/' + element.imgname,
                  thumbImage: 'http://localhost:3000/file/' + element.imgname,
                  title: element.metin
                };

                this.imagesslide.push(newImage);

              });
            }
            let alintilar = await QW.json('/noktalar/alinti/' + this.all_dialog_info[this.dialog_info_index].enlem + "/" + this.all_dialog_info[this.dialog_info_index].boylam)

            alintilar.Id.forEach((element: any) => {

              if (element.alintilar != "")
                this.alintilar.push([element.alintilar, element.seyahatname_adi, element.yazar, element.yuzyil]);

            });
            if (this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu == "-") {
              // let lokasyonId = await QW.json('/lokasyon/getId/' + this.all_dialog_info[this.dialog_info_index].enlem + '/' + this.all_dialog_info[this.dialog_info_index].boylam);
              // this.dialogImgs = await QW.json('/galeri/filter/' + lokasyonId.Id);
              // this.dialogImgs = this.dialogImgs.images;
              // this.dialogImgs.forEach((element: any) => {
              //   const newImage: img = {
              //     image: 'http://localhost:3000/file/' + element.imgname,
              //     thumbImage: 'http://localhost:3000/file/' + element.imgname,
              //     title: element.metin
              //   };
              //   this.imagesslide.push(newImage);
              // });
              this.point_info_dialog = this.all_dialog_info[this.dialog_info_index];

            }

            this.point_info_dialog.alintilar = this.alintilar

            dialogRef.componentInstance.data = this.getDialogData()
            this.map.flyTo({ center: [parseFloat(this.all_dialog_info[this.dialog_info_index].boylam), parseFloat(this.all_dialog_info[this.dialog_info_index].enlem)], zoom: 11, speed: 0.6 });
          }
        }
      }
      if (event.key === 'ArrowLeft') {
        this.imagesslide = [];
        this.alintilar = [];
        if (this.dialog_info_index != 0) {
          this.dialog_info_index = this.dialog_info_index - 1;
          console.log(this.all_dialog_info[this.dialog_info_index].enlem);

          if (this.all_dialog_info[this.dialog_info_index].enlem != 0) {
            if (this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu != "-") {
              this.point_info_dialog = await QW.json('/arazicalismasi/' + this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu);

              let lokasyonId = await QW.json('/lokasyon/getId/' + this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu);
              this.dialogImgs = await QW.json('/galeri/filter/' + lokasyonId.Id);
              this.dialogImgs = this.dialogImgs.images;
              this.dialogImgs.forEach((element: any) => {

                const newImage: img = {
                  image: 'http://localhost:3000/file/' + element.imgname,
                  thumbImage: 'http://localhost:3000/file/' + element.imgname,
                  title: element.metin
                };

                this.imagesslide.push(newImage);



              });
            }
            let alintilar = await QW.json('/noktalar/alinti/' + this.all_dialog_info[this.dialog_info_index].enlem + "/" + this.all_dialog_info[this.dialog_info_index].boylam)

            alintilar.Id.forEach((element: any) => {
              if (element.alintilar != "")
                this.alintilar.push([element.alintilar, element.seyahatname_adi, element.yazar, element.yuzyil]);

            });

            if (this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu == "-") {
              // let lokasyonId = await QW.json('/lokasyon/getId/' + this.all_dialog_info[this.dialog_info_index].enlem + '/' + this.all_dialog_info[this.dialog_info_index].boylam);
              // this.dialogImgs = await QW.json('/galeri/filter/' + lokasyonId.Id);
              // this.dialogImgs = this.dialogImgs.images;
              // this.dialogImgs.forEach((element: any) => {
              //   const newImage: img = {
              //     image: 'http://localhost:3000/file/' + element.imgname,
              //     thumbImage: 'http://localhost:3000/file/' + element.imgname,
              //     title: element.metin
              //   };
              //   this.imagesslide.push(newImage);
              // });
              this.point_info_dialog = this.all_dialog_info[this.dialog_info_index];

            }
            this.point_info_dialog.alintilar = this.alintilar


            dialogRef.componentInstance.data = this.getDialogData()
            this.map.flyTo({ center: [parseFloat(this.all_dialog_info[this.dialog_info_index].boylam), parseFloat(this.all_dialog_info[this.dialog_info_index].enlem)], zoom: 11, speed: 0.6 });
          }
        }
      }
    });
  }

  animateDashArray(timestamp: number): void {
    const newStep = Math.floor((timestamp / 50) % this.dashArraySequence.length);

    this.map.setPaintProperty(
      this.line_animation_kod + "dasharray",
      'line-dasharray',
      this.dashArraySequence[newStep]
    );

    requestAnimationFrame(this.animateDashArray.bind(this));
  }
  onClickHandler = async (e: any) => {

    this.imagesslide = [];
    this.alintilar = [];
    this.point_info_dialog = [];
    const description = e.features[0].properties;
    let id = description.Point_id.split(',')[1];

    let clickPoint = await QW.json('/noktalar/' + description.seyahname_kodu + '/' + id);

    if (clickPoint.data[0]["yapi_envanter_kodu"] != "-") {
      this.point_info_dialog = await QW.json('/arazicalismasi/' + clickPoint.data[0]['yapi_envanter_kodu']);
      let lokasyonId = await QW.json('/lokasyon/getId/' + clickPoint.data[0]['yapi_envanter_kodu']);
      this.dialogImgs = await QW.json('/galeri/filter/' + lokasyonId.Id);
      this.dialogImgs = this.dialogImgs.images;
      this.dialogImgs.forEach((element: any) => {
        const newImage: img = {
          image: 'http://localhost:3000/file/' + element.imgname,
          thumbImage: 'http://localhost:3000/file/' + element.imgname,
          title: element.metin
        };
        this.imagesslide.push(newImage);
      });


    }
    let filter = (element: any) => element.id == clickPoint.data[0]['id'];
    var allpoint = await QW.json('/noktalar/' + description.seyahname_kodu);
    this.all_dialog_info = allpoint.data;
    this.dialog_info_index = this.all_dialog_info.findIndex(filter);
    let alintilar = await QW.json('/noktalar/alinti/' + clickPoint.data[0]['enlem'] + "/" + clickPoint.data[0]['boylam'])

    this.map.flyTo({ center: [parseFloat(clickPoint.data[0]['boylam']), parseFloat(clickPoint.data[0]['enlem'])], zoom: 11, speed: 0.6 });

    alintilar.Id.forEach((element: any) => {

      if (element.alintilar != "")
        this.alintilar.push([element.alintilar, element.seyahatname_adi, element.yazar, element.yuzyil]);

    });

    if (this.all_dialog_info[this.dialog_info_index].yapi_envanter_kodu == "-") {
      // let lokasyonId = await QW.json('/lokasyon/getId/' + clickPoint.data[0]['enlem'] + '/' + clickPoint.data[0]['boylam']);
      // this.dialogImgs = await QW.json('/galeri/filter/' + lokasyonId.Id);
      // this.dialogImgs = this.dialogImgs.images;
      // this.dialogImgs.forEach((element: any) => {
      //   const newImage: img = {
      //     image: 'http://localhost:3000/file/' + element.imgname,
      //     thumbImage: 'http://localhost:3000/file/' + element.imgname,
      //     title: element.metin
      //   };
      //   this.imagesslide.push(newImage);
      // });
      this.point_info_dialog = clickPoint.data[0];
    }
    this.point_info_dialog.alintilar = this.alintilar
    console.log(this.imagesslide);

    this.openDialog();


  }
  async WatchLine(data: any) {
    const zoomLevel = 10; // Belirlediğin zoom seviyesi
    const cameraAltitude = 200000;

    // Rotanın uzunluğunu hesapla
    const route = await this.getTargetRoute(data);
    const cameraroute = await this.getCameraRoute(data);
    const routeDistance = turf.lineDistance(turf.lineString(route));
    const cameraRouteDistance = turf.lineDistance(turf.lineString(cameraroute));

    // Animasyon süresini rotanın uzunluğuna göre ayarla (Örnek: her km için 10 saniye)
    const animationDuration = routeDistance * 100;

    let start: number;

    // Zoom seviyesini ayarla
    this.map.setZoom(zoomLevel);

    const frame = (time: number) => {
      if (!start) start = time;
      const phase = (time - start) / animationDuration;

      if (phase > 1) {
        setTimeout(() => {
          start = 0.0;
        }, 2000);
      }

      const alongRoute = turf.along(
        turf.lineString(route),
        routeDistance * phase
      ).geometry.coordinates;

      const alongCamera = turf.along(
        turf.lineString(cameraroute),
        cameraRouteDistance * phase
      ).geometry.coordinates;

      const camera = this.map.getFreeCameraOptions();
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        {
          lng: alongCamera[0],
          lat: alongCamera[1]
        },
        cameraAltitude
      );

      camera.lookAtPoint({
        lng: alongRoute[0],
        lat: alongRoute[1]
      });

      this.map.setFreeCameraOptions(camera);

      // Zoom seviyesini tekrar ayarla
      this.map.setZoom(zoomLevel);

      this.animationFrameId = window.requestAnimationFrame(frame); // Save the frame ID
    };

    this.animationFrameId = window.requestAnimationFrame(frame); // Start the animation
    this.map.setPitch(-10);
    this.map.setBearing(-90);
  }


  private async getTargetRoute(id: any) {

    return await QW.json('/allcordinats/' + id);

  }

  private async getCameraRoute(id: any) {

    return await QW.json('/allcordinats/' + id);

  }
  stopAnimation() {
    if (this.animationFrameId !== null) {

      window.cancelAnimationFrame(this.animationFrameId); // Cancel the animation
      this.animationFrameId = null; // Reset the ID
      this.map.flyTo({ center: [27.422222, 38.630554], zoom: 6, speed: 1 });
    }
  }
  getDialogData() {
    return {
      Envanter_Kodu: this.point_info_dialog.Envanter_Kodu,
      Yapi_Adi: this.point_info_dialog.Yapi_Adi,
      Enlem: this.point_info_dialog.enlem,
      Boylam: this.point_info_dialog.boylam,
      Guzergah: this.point_info_dialog.Guzergah,
      Alternatif_Adi: this.point_info_dialog.Alternatif_Adi,
      Donemi: this.point_info_dialog.Donemi,
      Kitabesi: this.point_info_dialog.Kitabesi,
      Banisi: this.point_info_dialog.Banisi,
      Seyahatnamelerdeki_Anlatimi: this.point_info_dialog.Seyahatnamelerdeki_Anlatimi,
      Durumu: this.point_info_dialog.Durumu,
      Bugunki_Kullanimi: this.point_info_dialog.Bugunki_Kullanimi,
      Mimari_Ozellikler: this.point_info_dialog.Mimari_Ozellikler,
      Yasama_Ve_Eski_Kullanima_Dair_İzler: this.point_info_dialog.Yasama_Ve_Eski_Kullanima_Dair_İzler,
      Yapim_Teknigi_Ve_Malzeme: this.point_info_dialog.Yapim_Teknigi_Ve_Malzeme,
      Literatur_Ve_Arsiv_Kaynaklarindan_Notlar: this.point_info_dialog.Literatur_Ve_Arsiv_Kaynaklarindan_Notlar,
      Kaynakca: this.point_info_dialog.Kaynakca,
      Arazi_Calismasi_Tarihi: this.point_info_dialog.Arazi_Calismasi_Tarihi,
      Seyahat_Name_Adi: this.point_info_dialog.seyahatname_adi,
      Alintilar: this.point_info_dialog.alintilar,
      Mekan_Adi: this.point_info_dialog.anlatida_gecen_mekan_adi,
      Yuzyil: this.point_info_dialog.yuzyil,
      DialogImgs: this.imagesslide[0]?.image
    };
  }


}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  styleUrls: ['mapbox-2.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogTitle, MatDialogContent, LightgalleryModule, MySharedModules],
})
export class DialogContentExampleDialog {
  images: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) { }

  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

  settings = {
    counter: false,
    plugins: [lgZoom],
  };

  ngOnChanges() {
    this.cdr.detectChanges();
  }
}
interface img {

  image: string

  thumbImage: string

  title: string

}
