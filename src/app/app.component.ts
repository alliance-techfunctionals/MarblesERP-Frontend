// Angular Import
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConsoleToggleService } from './shared/service/console-toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // constructor
  constructor(private router: Router, private consoleToggleService: ConsoleToggleService) {
    this.consoleToggleService.disableConsoleInProduction();
  }

  // life cycle event
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
