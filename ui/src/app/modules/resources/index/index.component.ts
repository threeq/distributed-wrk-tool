import {Component, OnInit} from '@angular/core';
import {Machine, MachinesApiService} from "../../@common/api/machines-api.service";
import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  machines: Machine[];

  constructor(private router: Router,
              private machinesApi: MachinesApiService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,) {

    this.refreshData();
  }

  ngOnInit() {
  }

  refreshData() {
    this.machinesApi.page().subscribe(response => {
      this.machines = response.data.list;
    })
  }

}
