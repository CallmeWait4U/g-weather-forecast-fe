import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAccountComponent } from '../dialog-account/dialog-account.component';
import { HttpService } from '../http.service';

interface ForecastDay {
  date: Date;
  temp: string;
  wind: string;
  humi: string;
  conditionIcon: string;
}

interface SearchResult {
  cityName: string;
  date: Date;
  temp: string;
  wind: string;
  humi: string;
  conditionText: string;
  conditionIcon: string;
  forecastDays: ForecastDay[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  dialog = inject(MatDialog);
  showSearchedList = false;
  email: string = '';
  registered: boolean = false;
  listCityNames: string[] = [];
  result: SearchResult | null = null;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    const email = localStorage.getItem("email");
    this.email = email ? JSON.parse(email) : '';
    const registered = localStorage.getItem("registered");
    this.registered = registered ? JSON.parse(registered) : '';
    this.httpService.search('Ho Chi Minh City').subscribe((res) => {
      this.saveSearchResult(res);
      localStorage.setItem("listNames", JSON.stringify([res.cityName]));
      this.listCityNames = [res.cityName];
    })
  }

  saveSearchResult(res: SearchResult) {
    this.result = res;
  }

  logOut() {
    localStorage.clear();
    window.location.reload();
  }

  handleOnClick(name: string) {
    if (name !== '') {
      this.httpService.search(name).subscribe((res) => {
        this.saveSearchResult(res);
        const listNames = localStorage.getItem("listNames");
        if (listNames) {
          const names = JSON.parse(listNames) as string[];
          const index = names.findIndex((i) => i === res.cityName);
          if (index === -1) {
            names.unshift(res.cityName);
            localStorage.setItem("listNames", JSON.stringify(names));
          } else {
            names.splice(index, 1);
            names.unshift(res.cityName);
            localStorage.setItem("listNames", JSON.stringify(names));
          }
          this.listCityNames = names;
        } else {
          localStorage.setItem("listNames", JSON.stringify([res.cityName]));
          this.listCityNames = [res.cityName];
        }
      })
    }
  }

  openDialogAccount(signIn: boolean) {
    const ref = this.dialog.open(DialogAccountComponent, {
      disableClose: true,
      minWidth: '40vw',
      maxWidth: '100vw',
      panelClass: "custom-dialog-style",
      data: {
        signIn,
      }
    })
    ref.componentInstance.dataUser.subscribe((data) => {
      localStorage.setItem("email", JSON.stringify(data.email));
      localStorage.setItem("registered", JSON.stringify(data.registered));
      localStorage.setItem("listNames", JSON.stringify(data.searchedList));
    })
    ref.afterClosed()
    .subscribe((data) => {
      if (data) {
        this.dialog.open(DialogAccountComponent, {
          disableClose: true,
          minWidth: '40vw',
          maxWidth: '100vw',
          panelClass: "custom-dialog-style",
          data: {
            signIn: true,
          }
        })
        .afterClosed()
        .subscribe(() => {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    });
  }

  subscribe() {
    this.httpService.subscribe().subscribe(() => {
      this.registered = true;
      localStorage.setItem("registered", JSON.stringify(this.registered));
    });
  }

  unsubscribe() {
    this.httpService.unsubscribe().subscribe(() => {
      this.registered = false;
      localStorage.setItem("registered", JSON.stringify(this.registered));
    });
  }

  handleSearchedList() {
    this.showSearchedList = !this.showSearchedList;
    const listNames = localStorage.getItem("listNames");
    this.listCityNames = listNames ? JSON.parse(listNames) : [];
  }
}
