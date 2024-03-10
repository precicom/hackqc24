import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class PageInformation {
  title$ = new BehaviorSubject<string>('')

  setPagetitle(title: string){
    this.title$.next(title)
  }
}