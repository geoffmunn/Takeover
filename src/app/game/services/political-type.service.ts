import { Injectable } from '@angular/core';
import { LeftService } from './left.service';
import { RightService } from './right.service';

@Injectable({
  providedIn: 'root'
})
export class PoliticalTypeService {

  chosenType: any
  leftType: LeftService;
  rightType: RightService;

  constructor(leftType: LeftService, rightType: RightService) {
    this.leftType = leftType;
    this.rightType = rightType;
  }
}
