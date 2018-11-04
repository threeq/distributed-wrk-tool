import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {CurrentProject} from "../../projects.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Project} from "../../../@common/api/projects-api.service";
import * as _ from "lodash";
import {MatTableDataSource} from "@angular/material";
import {EChartOption, ECharts} from "echarts-ng2";
import {ModelConf, Scene, ScenesApiService, UrlConf} from "../../../@common/api/scenes-api.service";

@Component({
  selector: 'app-scene-add',
  templateUrl: './scene-add.component.html',
  styleUrls: ['./scene-add.component.scss']
})
export class SceneAddComponent implements OnInit {

  sceneNameCtrl = new FormControl('', [
    Validators.required]);

  scene: Scene = new Scene();
  private project: Project = new Project();
  codemirrorConfig;

  testUrlsTableColumns = ['url', 'thresholds_sr', 'thresholds_tps', 'thresholds_rt_avg', 'thresholds_rt_99', 'thresholds_rt_95', 'thresholds_rt_90', 'thresholds_rt_75', 'thresholds_rt_50'];
  testUrlsTableSource: MatTableDataSource<UrlConf>;

  testModelsTableColumns = Object.keys(new ModelConf()).concat(["process"]);
  testModelsTableSource = new MatTableDataSource<ModelConf>();

  @ViewChild('echartsTestModelPie') echarts: ECharts;
  testModelPieOpts: EChartOption = this.createTestModelPieOpts();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scenesApi: ScenesApiService,
  ) {
    this.testUrlsTableSource = new MatTableDataSource<UrlConf>(this.scene.testUrls);

    this.codemirrorConfig = {
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
    this.defaultSceneData();

    this.project._id = this.route.snapshot.params['id'];
    this.scene.projectId = this.project._id;

    // this.route.params.subscribe(params => {
    //   this.project._id = params['id']
    // });
  }

  addUrl() {
    this.doAddUrlConf(new UrlConf());
  }

  copyUrl(urlDef: UrlConf, index, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.doAddUrlConf(_.cloneDeep(urlDef));
  }

  private doAddUrlConf(urlConf: UrlConf) {
    this.scene.testUrls.push(urlConf);
    this.testUrlsTableSource.data = this.scene.testUrls;
  }

  deleteUrl(urlDef: any, index, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.scene.testUrls.splice(index, 1);
    this.testUrlsTableSource.data = this.scene.testUrls;
  }

  addModel() {
    this.doAddModel(new ModelConf());
    this.updateModelPie();
  }

  deleteModel(model) {
    this.doDeleteModel(model);
    this.updateModelPie();
  }

  updateModelPie() {
    this.testModelPieOpts = this.createTestModelPieOpts();
  }

  doSubmit() {
    console.log(this.scene)
    this.scenesApi.add(this.scene).subscribe(data => {
      console.log("add response:", data)
      this.router.navigateByUrl("/modules/projects/" + this.project._id)
    })
  }

  doCancel() {
    this.router.navigateByUrl("/modules/projects/" + this.project._id)
  }

  private doAddModel(model) {
    model.sort = this.scene.testModels.length;
    if (!model.name) {
      model.name = String(model.sort + 1);
    }
    this.scene.testModels.push(model);
    this.testModelsTableSource.data = this.scene.testModels;
    return model;
  }

  private doDeleteModel(model) {
    this.scene.testModels.splice(model.sort, 1);
    this.scene.testModels.forEach((model, index) => {
      if (model.name == String(model.sort + 1)) {
        model.name = String(index + 1);
      }
      model.sort = index;
    });
    this.testModelsTableSource.data = this.scene.testModels;
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
          data: this.scene.testModels.map(model => {
            return {name: model.name, value: model.loadRate}
          })
        }
      ]
    };
  }

  private defaultSceneData() {
    this.scene.name = "Scene Example";
    this.scene.connections = 1;
    this.scene.durations = 1;
    this.scene.threads = 1;
    this.scene.timeout = 1;

    let host = window.location.host;
    let model = new ModelConf();
    model.name = "model 1";
    model.url = host;
    model.loadRate = 100;
    this.doAddModel(model);

    let urlConf = new UrlConf();
    urlConf.url = host;
    urlConf.method = 'GET';
    urlConf.thresholds = {
      "sr": 99.9,
      "tps": 10,
      "rt_avg": 100,
      "rt_99": 100,
      "rt_95": 100,
      "rt_90": 100,
      "rt_75": 100,
      "rt_50": 100
    };
    this.doAddUrlConf(urlConf);

  }

}
