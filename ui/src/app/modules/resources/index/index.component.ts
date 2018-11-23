import {Component, OnInit} from '@angular/core';
import {Machine, MachinesApiService, MachineType} from "../../@common/api/machines-api.service";
import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import * as go from "gojs";
import * as _ from 'lodash';
import {ResourceAddComponent} from "../add/resource-add.component";

let $ = go.GraphObject.make;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  machines: Machine[];
  myDiagram: go.Diagram;
  hasRoot: boolean = true;

  constructor(private router: Router,
              private machinesApi: MachinesApiService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,) {

    this.refreshData();
  }

  addMachine(machine: Machine) {
    let newMachine = new Machine();
    newMachine.name = '主机';
    newMachine.ip = '127.0.0.1';
    newMachine.parent = machine._id;

    this.editResource(newMachine);
  }

  editMachine(machine: Machine) {
    this.editResource(machine);

  }

  delMachine(machine: Machine) {
    this.deleteResource(machine._id);
  }

  ngOnInit() {

    // define a simple Node template
    let defaultAdornment =
      $(go.Adornment, "Spot",
        $(go.Panel, "Auto",
          $(go.Shape, {
            fill: null,  // changed to a color in the mouseEnter event handler
            stroke: "dodgerblue",
            strokeWidth: 4,
          }),
          $(go.Placeholder)),
        // 底部操作栏
        $(go.Panel, "Horizontal",
          {
            alignment: go.Spot.Bottom,
          },
          nodeBtn('添加', (nodeData)=>this.addMachine(nodeData.data)),
          nodeBtn('修改', (nodeData)=>this.editMachine(nodeData.data)),
          nodeBtn('删除', (nodeData)=>this.delMachine(nodeData.data))
        )
      )
    ;

    function nodeBtn(text, fn) {
      return $('Button',
        {
          click: function toggleChildren(e, obj) {
            let clickedNode = obj.part;
            if (clickedNode !== null) {
              fn && fn(clickedNode.data);
            }
          }
        },
        new go.Binding('visible', '', function (a) {
          let type = a.data.category;
          if(text === '删除' && type === 'root') {
            return false;
          } else if((text==='添加' && (type==='test' || type==='service'))) {
            return false;
          }
          return true;
        }).ofObject(),
        $(go.TextBlock, "Reason",
          {
            text: text,
            margin: new go.Margin(4, 0, 0, 0),
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
          })
      )
    }

    this.myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
          allowSelect: true,  // the user cannot select any part
          initialContentAlignment: go.Spot.Left,

          initialAutoScale: go.Diagram.Uniform,
          // create a TreeLayout for the decision tree
          layout: $(go.TreeLayout),
          nodeSelectionAdornmentTemplate: defaultAdornment
        });

    function nodeStyle(color) {
      return [
        // {selectionAdornmentTemplate: defaultAdornment},
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            {fill: color, strokeWidth: 1},
            {minSize: new go.Size(135, NaN),}
          ),
          $(go.Panel, 'Vertical',
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                // maxSize: new go.Size(400, 400),
                wrap: go.TextBlock.WrapFit,
                editable: false,
              },
              new go.Binding("text", "name")),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                // maxSize: new go.Size(400, 400),
                wrap: go.TextBlock.WrapFit,
                editable: false,
              },
              new go.Binding("text", "ip")),)
        )
      ];
    }

    function textStyle() {
      return {
        font: "bold 11pt Helvetica, Arial, sans-serif",
        stroke: "whitesmoke"
      }
    }

    this.myDiagram.nodeTemplateMap.add("root",
      $(go.Node, "Table", nodeStyle('#0dc932'),
        // 右边展开折叠按钮
        $("TreeExpanderButton",
          {alignment: go.Spot.RightCenter, alignmentFocus: go.Spot.Top},
          new go.Binding("visible", "", function (a) {
            return !a.diagram.isReadOnly;
          }).ofObject(),
        ),
      ));
    // define a simple Node template
    this.myDiagram.nodeTemplateMap.add("monitor",
      $(go.Node, "Table", nodeStyle('#c9c023'),
        // 右边展开折叠按钮
        $("TreeExpanderButton",
          {alignment: go.Spot.RightCenter, alignmentFocus: go.Spot.Top},
          new go.Binding("visible", "", function (a) {
            return !a.diagram.isReadOnly;
          }).ofObject(),
        ),
      ));
    this.myDiagram.nodeTemplateMap.add("test",
      $(go.Node, "Table", nodeStyle('#4697c9'),
      ));

    this.myDiagram.nodeTemplateMap.add("service",
      $(go.Node, "Table", nodeStyle('#ff899f'),
      ));

  }

  refreshData() {
    this.machinesApi.page().subscribe(response => {
      this.machines = response.data.list;

      let typeMapping = ['root', 'monitor', 'service', 'test'];

      let root: any = _.filter(response.data.list, (it: Machine) => {
        return it.type === 0
      });

      if (root.length === 0) {
        this.hasRoot = false;
        return;
      } else {
        this.hasRoot = true;
      }

      let model = $(go.TreeModel);
      model.nodeDataArray = _.map(response.data.list, it => {
        return {
          category: typeMapping[it.type],
          parent: it.parent ? it.parent : '',
          key: it._id,
          ip: it.ip,
          name: it.name,
          data: it
        }
      });

      this.myDiagram.model = model;
    })
  }

  addRootMonitorNode() {
    let defaultRoot = new Machine();
    defaultRoot.name = 'Promethues 监控';
    defaultRoot.type = MachineType.MONITOR_ROOT;
    defaultRoot.ip = '127.0.0.1';

    this.editResource(defaultRoot);
  }

  editResource(resource) {
    const dialogRef = this.dialog.open(ResourceAddComponent, {
      data: _.cloneDeep(resource)
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  deleteResource(id) {
    this.machinesApi.delete(id).subscribe(result => {
      if (result) {
        this.refreshData();
      }
    })
  }
}
