import {Component, OnInit} from '@angular/core';
import {Machine, MachinesApiService} from "../../@common/api/machines-api.service";
import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import * as go from "gojs/release/go-debug";

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
    let $ = go.GraphObject.make;
    let myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
          "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
          initialContentAlignment: go.Spot.Left,
          allowSelect: false,  // the user cannot select any part
          // create a TreeLayout for the decision tree
          layout: $(go.TreeLayout)
        });

    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center
        }
      ];
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    function makePort(name, align, spot, output, input) {
      var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
      // the port is basically just a transparent rectangle that stretches along the side of the node,
      // and becomes colored when the mouse passes over it
      return $(go.Shape,
        {
          fill: "transparent",  // changed to a color in the mouseEnter event handler
          strokeWidth: 0,  // no stroke
          width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
          alignment: align,  // align the port on the main Shape
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
          portId: name,  // declare this object to be a "port"
          fromSpot: spot,  // declare where links may connect at this port
          fromLinkable: output,  // declare whether the user may draw links from here
          toSpot: spot,  // declare where links may connect at this port
          toLinkable: input,  // declare whether the user may draw links to here
          cursor: "pointer",  // show a different cursor to indicate potential link point
          mouseEnter: function (e, port) {  // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: function (e, port) {
            port.fill = "transparent";
          }
        });
    }

    function textStyle() {
      return {
        font: "bold 11pt Helvetica, Arial, sans-serif",
        stroke: "whitesmoke"
      }
    }

    // define a simple Node template
    myDiagram.nodeTemplateMap.add("node",
      $(go.Node, "Table", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto",
          $(go.Shape, "Diamond",
            {fill: "#00A9C9", strokeWidth: 0},
            new go.Binding("figure", "figure")),
          $(go.TextBlock, textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      ));


    let model = $(go.TreeModel);
    model.nodeDataArray =
      [
        {key: "A", "name": "Stella Payne Diaz", "title": "CEO", category: 'node'},
        {key: "B", "name": "Stella Payne Diaz", "title": "CEO", "parent": "A", category: 'node'},
        {key: "C", "name": "Stella Payne Diaz", "title": "CEO", "parent": "A", category: 'node'}
      ];
    myDiagram.model = model;
  }

  refreshData() {
    this.machinesApi.page().subscribe(response => {
      this.machines = response.data.list;
    })
  }

}
