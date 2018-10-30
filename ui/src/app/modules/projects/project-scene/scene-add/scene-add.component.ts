import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {CurrentProject} from "../../projects.component";
import {Router} from "@angular/router";
import {Project} from "../../../@common/api/projects-api.service";
import * as _ from "lodash";
import {MatTableDataSource} from "@angular/material";
import {EChartOption, ECharts} from "echarts-ng2";

@Component({
  selector: 'app-scene-add',
  templateUrl: './scene-add.component.html',
  styleUrls: ['./scene-add.component.scss']
})
export class SceneAddComponent implements OnInit {

  sceneNameCtrl = new FormControl('', [
    Validators.required]);

  sceneName: string;
  url: string;
  threads: number;
  connections: number;
  durations: number;
  timeout: number;
  script: string;
  private project: Project;
  config;

  testUrls: UrlConf[] = [new UrlConf()];
  testUrlsTableColumns = ['url', 'thresholds_sr', 'thresholds_tps','thresholds_rt_avg', 'thresholds_rt_99', 'thresholds_rt_95', 'thresholds_rt_90', 'thresholds_rt_75', 'thresholds_rt_50'];
  testUrlsTableSource: MatTableDataSource<UrlConf>;

  testModels: TestModel[] = [];
  testModelsTableColumns = Object.keys(new TestModel()).concat(["process"]);
  testModelsTableSource = new MatTableDataSource<TestModel>();

  @ViewChild('echartsTestModelPie') echarts: ECharts;
  testModelPieOpts: EChartOption = this.createTestModelPieOpts();

  constructor(
    private router: Router
  ) {
    // if (!CurrentProject.project) {
    //   this.router.navigateByUrl("/modules/projects");
    //   return
    // }
    // this.project = CurrentProject.project;
    this.project = new Project("Test");
    this.testUrlsTableSource = new MatTableDataSource<UrlConf>(this.testUrls);


    this.config = {
      lineNumbers: true,
      theme: "neat",
      mode: 'text/x-lua',
      extraKeys: {
        "F11": function (cm) {
          console.log("F11", cm);
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function (cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }
    };
  }

  ngOnInit() {
    console.log(this.testModelsTableColumns)
  }

  addUrl() {
    this.testUrls.push(new UrlConf());
    this.testUrlsTableSource.data = this.testUrls;
  }

  copyUrl(urlDef: UrlConf, index, $event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.testUrls.push(_.cloneDeep(urlDef));
    this.testUrlsTableSource.data = this.testUrls;
  }

  deleteUrl(urlDef: any, index, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.testUrls.splice(index, 1);
    this.testUrlsTableSource.data = this.testUrls;
  }

  addModel() {
    this.doAddModel(new TestModel());
    this.updateModelPie();
  }

  deleteModel(model) {
    this.doDeleteModel(model);
    this.updateModelPie();
  }

  updateModelPie() {
    this.testModelPieOpts = this.createTestModelPieOpts();
  }

  private doAddModel(model) {
    model.sort = this.testModels.length;
    if (!model.name) {
      model.name = String(model.sort + 1);
    }
    this.testModels.push(model);
    this.testModelsTableSource.data = this.testModels;
  }

  private doDeleteModel(model) {
    this.testModels.splice(model.sort, 1);
    this.testModels.forEach((model, index) => {
      console.log(model.name, model.sort);
      if (model.name == String(model.sort+1)) {
        model.name = String(index + 1);
      }
      model.sort = index;
    });
    this.testModelsTableSource.data = this.testModels;
  }

  private createTestModelPieOpts(): EChartOption {
    return {
      title: {
        text: '压力模型 100%',
        x: 'right'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        top: 40,
        right: 10,
      },
      series: [
        {
          name: '压力分布图',
          type: 'pie',
          radius: ['30%', '45%'],
          center: ['30%', '35%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.testModels.map(model => {
            return {name: model.name, value: model.loadRate}
          })
        }
      ]
    };
  }
}

export class TestModel {
  sort: number = 0;
  name: string = "";
  url: string = "";
  loadRate: number = 0;
}

export class UrlConf {
  method: string = 'GET';
  url: string;
  headers: object = {};
  body: any = "";
  checkPoints: any = "";
  thresholds: any[]= [];
}

export enum TestCheckType {
  SuccessRate,        // 成功率
  AvgTps,             // 平均 TPS
  AvgResponseTime,    // 平均 响应时间
  P99ResponseTime,
  P95ResponseTime,
  P90ResponseTime,
  P75ResponseTime,
  P50ResponseTime,
}
