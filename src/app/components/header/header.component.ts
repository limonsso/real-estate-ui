import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Observable,  of} from "rxjs";
import {User} from "../../models/user";
import {UserTypeEnum} from "../../models/UserType.enum"
import {LocalStorageService, SessionStorageService, LocalStorage, SessionStorage} from 'angular-web-storage';
import {Router} from "@angular/router";
import {BroadcastService} from "../../services/broadcast.service";
import {select} from "@ngrx/store";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public currentUser$ = new Observable<User>();
  public currentUser: User=null;
  public UserTypeEnum= UserTypeEnum;
  public favoritesCount$ = new Observable<Number>();

  constructor(private readonly userService: UserService,
              private readonly localStorage: LocalStorageService,
              private readonly route: Router,
              private  readonly broadcastService: BroadcastService) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.userService.currentUser
    this.currentUser = this.userService.currentUserValue
    this.favoritesCount$ = of(this.userService.currentUserValue.favoritesProperties.length);
    this.userService.currentUser.subscribe(x =>{
        this.favoritesCount$ = of(x.favoritesProperties.length)
      });
  }



  connect() {
    this.userService.login("zekinan@example.com", "String1@").subscribe(data => {
      this.currentUser$ =of(data);
      this.currentUser = data;
      this.broadcastService.broadcast('user-is-connected')
    })
  }

  displayDropdown($event) {
    $event.target.style.color = "#0fca98"
    let el = $event.target.parentElement.querySelector(".nav-dropdown");
    if(el){
      el.style.display = 'block';
      window.setTimeout(function(){
        el.style.opacity = 1;
      },0);
    }
  }

  hiddenDropDown($event) {
    $event.target.querySelector(".nav-menu-item").style.color = "#4e5c79"
    let el = $event.target.querySelector(".nav-dropdown");
    if(el){
      el.style.opacity = 0;
      window.setTimeout(function(){
        el.style.display = 'none';
      },200); // timed to match animation-duration
    }
  }

  logout() {
    this.userService.logout();
    window.location.reload()

  }
}
