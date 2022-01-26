import {
  AfterViewInit,
  Component, ElementRef, Input,
  OnInit,
  QueryList, ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { PropertyMapInfo } from "../../models/property-map-info";


declare var H: any;

@Component({
  selector: 'app-property-map',
  templateUrl: './property-map.component.html',
  styleUrls: ['./property-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PropertyMapComponent implements OnInit, AfterViewInit {

  @Input()
  LongitudeCenter: number = 46.39712;
  @Input()
  LatitudeCenter: number = -75.542118;

  @Input()
  PropertiesInfos: PropertyMapInfo[] = null;

  @ViewChildren("propertymap") public mapElement: QueryList<ElementRef>;

  private platform: any;
  private map: any;
  constructor() { }

  ngOnInit() {
    this.platform = new H.service.Platform({
      'apikey': 'fuYPnccj6wP-Bpj3fzLRqewjIs9BIuN6k_ScYPD-4Lk',
      useHTTPS: true
    });
  }

  ngAfterViewInit(): void {

    this.initMap();

    // Define a variable holding SVG mark-up that defines an icon image:
    let svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="40px" viewBox="0 0 24 24" width="40px" fill="#000000"><g><rect fill="none" height="24" width="24" y="0"/></g><g><path d="M12,2c-4.2,0-8,3.22-8,8.2c0,3.18,2.45,6.92,7.34,11.23c0.38,0.33,0.95,0.33,1.33,0 C17.55,17.12,20,13.38,20,10.2C20,5.22,16.2,2,12,2z M12,12c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2 C14,11.1,13.1,12,12,12z" enable-background="new"/></g></svg>`;

    // Create an icon, an object holding the LatitudeCenter and LongitudeCenter, and a marker:
    const icon = new H.map.Icon(svgMarkup),
      coords = { lat: this.LatitudeCenter, lng: this.LongitudeCenter },
      coords2 = { lat: 46.343566, lng: -72.568335 },
      marker = new H.map.Marker(coords, { icon: icon }),
      marker2 = new H.map.Marker(coords2, { icon: icon });
    this.addMarker(this.map, coords)

    console.log(this.PropertiesInfos);
  }

  initMap() {
    let x = this.mapElement;
    let pixelRatio = window.devicePixelRatio || 1;
    let defaultLayers = this.platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });
    this.map = new H.Map(x.first.nativeElement,
      defaultLayers.vector.normal.map, {
      zoom: 15,
      center: { lat: this.LatitudeCenter, lng: this.LongitudeCenter }
    });
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    let ui = H.ui.UI.createDefault(this.map, defaultLayers);
  }

  addMarker(map, coords) {
    var prtyElt = document.createElement('div')
    prtyElt.innerHTML = `
    <style>
                .ico {
                  color: rgb(24, 24, 24);
                  font-size: 40px;
                  cursor: pointer;
                }

                .tooltip-custom {
                  font-size: small;
                  max-width: 100%;
                  display: flex;
                  position: absolute;
                  z-index: 98;
                  margin-top: -135px;
                  margin-left: -160px;
                  background-color: rgba(255, 255, 255);
                  border-radius: 8px;
                  padding: 5px;
                  box-shadow: 0 2px 7px 1px rgb(0 0 0 / 10%);
                  box-sizing: border-box;
                  opacity: 0;
                  transition: .6s ease opacity;
                }

                .tooltip-info {
                  display: flex;
                  flex-direction: column;
                }

                .tooltip-custom img {
                  max-width: 55%;
                  flex: 1 1 100%;
                  margin-right: 10px;
                }

                .tooltip-custom:before {
                  content: "";
                  position: absolute;
                  /* position tooltip correctly */
                  left: 50%;
                  /* vertically center */
                  top: 100%;
                  /* the arrow */
                  border: 10px solid rgb(255, 255, 255);
                  border-color: rgba(255, 255, 255) transparent transparent transparent;
                  box-sizing: border-box;
                }
              </style>
              <a class="tooltip-custom">
                <img src="	https://themezhub.net/resido-live-02/resido/assets/img/p-4.jpg">
                <div class="tooltip-info">
                  <strong>Quadruplex à vendre</strong>
                  <span><strong>5000$</strong></span>
                  <span>1520 - 1526, Rue Léo-Ayotte, Trois-Rivières</span>
                </div>
              </a>
              <span class="material-icons ico" style="font-size:36px; ">
                location_on
              </span>`
    prtyElt.style.width = '340px'
    function changeOpacity(evt) {
      evt.target.querySelector('.tooltip-custom').style.opacity = 0;
    };

    function changeOpacityToOne(evt) {
      evt.target.querySelector('.tooltip-custom').style.opacity = 1;
    };

    var domIcon = new H.map.DomIcon(prtyElt,
      // {
      //   // the function is called every time marker enters the viewport
      //   onAttach: function (clonedElement, domIcon, domMarker) {
      //     clonedElement.addEventListener('mouseover', changeOpacity);
      //     clonedElement.addEventListener('mouseout', changeOpacityToOne);
      //   },
      //   // the function is called every time marker leaves the viewport
      //   onDetach: function (clonedElement, domIcon, domMarker) {
      //     clonedElement.removeEventListener('mouseover', changeOpacity);
      //     clonedElement.removeEventListener('mouseout', changeOpacityToOne);
      //   }
      // }
    );

    // Marker for Chicago Bears home
    var bearsMarker = new H.map.DomMarker(coords, {
      icon: domIcon
    });

    map.addObject(bearsMarker);
  }
}
