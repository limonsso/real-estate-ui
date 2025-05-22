import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressHttp } from 'ngx-progressbar/http';
import { DomHandlerService } from '@services/dom-handler.service';
import { Settings, SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-root',
  imports: [
    NgClass,
    RouterOutlet,
    TranslateModule,
    NgProgressbar,
    NgProgressHttp
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public settings: Settings;
  constructor(public settingsService: SettingsService,
    public router: Router,
    public translate: TranslateService,
    private domHandlerService: DomHandlerService) {
    this.settings = this.settingsService.settings;
    translate.addLangs(['en', 'de', 'fr', 'ru', 'tr']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.domHandlerService.winScroll(0, 0);
      }
    });
  }
}
