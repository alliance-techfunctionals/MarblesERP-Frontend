import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationItem, NavigationItems } from '../navigation';
import { Location, LocationStrategy } from '@angular/common';
import { environment } from 'src/environments/environment';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigations: NavigationItem[];
  wrapperWidth!: number;
  windowWidth: number;

  @Output() NavMobCollapse = new EventEmitter();
  // constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy
  ) 
  {
    this.windowWidth = window.innerWidth;
    this.navigations = NavigationItems;

    // get the token from localstorage
    const token = localStorage.getItem('Token');
    if(token){
      const decodedToken: any = jwtDecode(token)
      const userRole = decodedToken["UserRole"]
      this.navigations = this.filterNavigationsByRole(this.navigations, userRole);
    }
  }

  private filterNavigationsByRole(navigations: NavigationItem[], userRole: string): NavigationItem[] {
    return navigations
      .map(navigation => {
        if (navigation.roles && !navigation.roles.includes(userRole)) {
          return null;
        }

        if (navigation.children) {
          const filteredChildren = this.filterNavigationsByRole(navigation.children, userRole);
          if (filteredChildren.length > 0) {
            return { ...navigation, children: filteredChildren };
          } else {
            return null;
          }
        }

        return navigation;
      })
      .filter(navigation => navigation !== null) as NavigationItem[]; // Filter out null values
  }

  // life cycle event
  ngOnInit() {
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
    }
  }

  // public method

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
