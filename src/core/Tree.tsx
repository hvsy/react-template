import _ from "lodash";
import {ReactNode} from "react";

export class Tree<T extends object = any>{
    data : T;
    children : Tree<T>[] = [];
    key : string;
    creator : new()=>T;
    parent ?: Tree<T>;
    paths : string[] = [];
    isRoot(){
        return !this.parent;
    }
    getPath(glue : string = '/'){
        return this.paths.join(glue);
    }
    setParent(parent : Tree<T>){
        this.parent = parent;
    }
    fromRoot(){
        const paths = [];
        let current : Tree<T> = this;
        while(current.parent){
            paths.push(current);
            current = current.parent;
        }
        return paths.reverse();
    }
    constructor(key : string,creator : new()=>T){
        this.key = key;
        this.data = new creator();
        this.creator = creator;
    }
    addItem(key : string,node : any){
        const newItem = new Tree<T>(key,this.creator);
        newItem.data = node;
        newItem.parent = this;
        const cIdx = this.children.push(newItem);
        newItem.paths = [...this.paths,cIdx + ''];
        return newItem;
    }
    next(key : string){
        let cIdx = _.findIndex(this.children,(t)=>t.key === key);
        if(cIdx === -1){
            const newItem = new Tree<T>(key,this.creator);
            newItem.parent = this;
            this.children.push(newItem);
            cIdx = this.children.length-1;
            newItem.paths = [...this.paths,cIdx + ''];
        }
        return this.children[cIdx];
    }
    static factory<T extends object = any>(creator : new()=>T,key : string = ''):Tree<T>{
        return new Tree<T>(key,creator);
    }
    
    renderBy(render : (node : Tree<T>)=>ReactNode) : any[]{
        return [];
    }
}
