import {useSWRConfig, MutatorOptions} from "swr";

export type MatcherKey = null | RegExp | string | ((key: string) => boolean);
export type MutateReturn = Promise<(any[]) | void>;
export type MutateCallback = ((key: MatcherKey, options ?: MutatorOptions) => MutateReturn);

export function useMatchMutate(): MutateCallback{
    const {
              cache,
              mutate,
          } = useSWRConfig();
    return (matcher: MatcherKey, ...args: any[]) => {
        if(!matcher){
            return Promise.resolve();
        }
        if(!(cache instanceof Map)){
            throw new Error('matchMutate requires the cache provider to be a Map instance');
        }
        
        const keys = [];
        
        for(const key of cache.keys()){
            switch(typeof matcher){
                case 'string':
                {
                    if(key.indexOf(matcher) !== -1){
                        keys.push(key);
                    }
                }
                    break;
                case "function":
                {
                    if(matcher(key)){
                        keys.push(key);
                    }
                }
                    break;
                case 'object':
                {
                    if(matcher.test(key)){
                        keys.push(key);
                    }
                }
                    break;
            }
        }
        console.log('match mutate:',keys,cache.keys());
        const mutations = keys.map((key) => {
            cache.delete(key);
            mutate(key, ...args);
        });
        return Promise.all(mutations);
    };
}
