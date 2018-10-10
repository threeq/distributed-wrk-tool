import { Component, OnInit } from '@angular/core';
import {FileDatabase, FileFlatNode, FileNode} from "./sidenav.data";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";
import {Observable, of as observableOf} from 'rxjs';



@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  providers: [FileDatabase]
})
export class SidenavComponent implements OnInit {

  treeControl: FlatTreeControl<FileFlatNode>;

  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  constructor(database: FileDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  transformer = (node: FileNode, level: number) => {
    let flatNode = new FileFlatNode();
    flatNode.filename = node.filename;
    flatNode.type = node.type;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    return flatNode;
  }

  private _getLevel = (node: FileFlatNode) => { return node.level; };

  private _isExpandable = (node: FileFlatNode) => { return node.expandable; };

  private _getChildren = (node: FileNode): Observable<FileNode[]> => {
    return observableOf(node.children);
  }

  hasChild = (_: number, _nodeData: FileFlatNode) => { return _nodeData.expandable; };

  ngOnInit() {
  }

}
