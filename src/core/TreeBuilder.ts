import {Tree} from "./Tree";

export type BuilderAssigner<T> = (node : T,options : {path : string,key : string})=>void;
export function TreeBuilder<T extends object = any>(creator : new ()=>T){
    return class {
        glue :RegExp | string;
        hit : RegExp;
        assigner : BuilderAssigner<Tree<T>>
        constructor(hit : RegExp,glue : RegExp| string = '/',assigner : BuilderAssigner<Tree<T>>){
            this.glue = glue;
            this.hit = hit;
            this.assigner = assigner;
        }
        static factory(){
            return Tree.factory(creator);
        }
        parse(keys : string[],root : Tree<T> = Tree.factory(creator)){
            keys.forEach((key) => {
                console.group(`parse ${key}`);
                const path = key.substring(2);
                console.log('path:',path);
                let current = root;
                if(this.hit.test(path)){
                    this.assigner(current,{key,path});
                }else{
                    const segments = path.split(this.glue);
                    console.log('segments:',segments);
                    segments.filter(s=>!!s).forEach((segment) => {
                        if(!this.hit.test(segment)){
                            current = current.next(segment);
                        }else{
                            // const [moduleName,path] = segment.split(this.glue);
                            // console.log('module name:',moduleName,path);
                            // if(moduleName){
                            //     current = current.next(moduleName);
                            // }
                            const after = segment.replace('.tsx','');
                            this.assigner(current,{path:after,key});

                        }
                    });
                }
                console.groupEnd();
            });
            return root;
        }
    }
}
