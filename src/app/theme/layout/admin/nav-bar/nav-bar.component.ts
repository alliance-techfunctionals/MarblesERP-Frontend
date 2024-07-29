// Angular Import
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(private router: Router) { }
  // public props
  menuClass = false;
  collapseStyle = 'none';
  windowWidth = window.innerWidth;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();

  // public method
  logOut() {
    localStorage.removeItem('Token');
    this.router.navigate(['auth/signin'])
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.NavCollapse.emit();
    }
  }
}
