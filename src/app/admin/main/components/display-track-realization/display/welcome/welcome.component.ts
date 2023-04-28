import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @Input('station') station: any;
  constructor() { }

  ngOnInit(): void {
  }

}
