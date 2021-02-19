import { useContext, createContext } from "react";
import { types, onSnapshot, flow  } from "mobx-state-tree";
import { Ticker } from "./Ticker";
import { fetchTickers } from "../utils/Api";

const RootModel = types
    .model({
        tickers: types.array(Ticker),
        test: types.string,
        state: types.enumeration("State", ["pending", "done", "error"]) 
    })    
    .actions(self => ({
        fetchTickers: flow(function* fetchProjects() { // <- note the star, this a generator function!
            console.log("hola2")
            //self.tickers.clear();
            self.state = "pending"
            try {
                let result = yield fetchTickers();
                console.log(result);
                self.tickers = result;
                //self.tickers = new Map(result.map(obj => [obj.key, obj.val]));
                //result.map(obj => self.tickers.set(obj.key, obj.val));
                console.log(self.tickers);
                self.state = "done"
            } catch (error) {
                console.error("Failed to fetch projects", error)
                self.state = "error"
            }
        })
}))
  
let initialState = RootModel.create({
    test: "asd",
    state: "pending",
});
  
/*const data = localStorage.getItem('rootState');

if (data) {
    const json = JSON.parse(data);
    if (RootModel.is(json)) {
        initialState = RootModel.create(json);
    }
}*/

export const rootStore = initialState;

onSnapshot(rootStore, snapshot => {
    console.log("Snapshot: ", snapshot);
    //localStorage.setItem('rootState', JSON.stringify(snapshot));
});
  

const MSTContext = createContext(null);

// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider;

export function useMst(mapStateToProps) {
    const store = useContext(MSTContext);
  
    if (typeof mapStateToProps !== 'undefined') {
      return mapStateToProps(store);
    }
  
    return store;
}
  