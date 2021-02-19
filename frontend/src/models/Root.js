import { useContext, createContext } from "react";
import { types, onSnapshot, flow  } from "mobx-state-tree";
import { Ticker } from "./Ticker";
import { fetchTickers } from "../utils/Api";
import moment from 'moment';
import { randomInteger } from '../utils/Helpers';

const RootModel = types
    .model({
        tickers: types.array(Ticker),
        test: types.string,
        state: types.enumeration("State", ["pending", "done", "error"]) 
    })    
    .actions(self => ({
        fetchTickers: flow(function* fetchProjects() { // <- note the star, this a generator function!
            //self.tickers.clear();
            self.state = "pending"
            try {
                let result = yield fetchTickers();
                //console.log(result);
                self.tickers = result;
                //self.tickers = new Map(result.map(obj => [obj.key, obj.val]));
                //result.map(obj => self.tickers.set(obj.key, obj.val));
                //console.log(self.tickers);
                self.state = "done"
            } catch (error) {
                console.error("Failed to fetch projects", error)
                self.state = "error"
            }
        })
    }))
    .views(self => {
        return {
            get remainingCloseTime() { // TODO: Not working
                if (self.tickers.length > 0) {
                    let fTicker = self.tickers[0];
                    if (!fTicker.candlesticks || !fTicker.latestOHLC) return 0;

                    let time = new Date(fTicker.latestOHLC.timestamp);

                    if (time) {
                        console.log(time);
                        var ms = moment(time,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"));
                        var d = moment.duration(ms);
                        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

                        return s;
                    }
                }

                return null;
            },
            get cprUntestedCount() {
                return randomInteger(0,30);
            },
            get cprNeutralCount() {
                return randomInteger(0,30);
            },
            get cprBelowCount() {
                return randomInteger(0,30);
            },
            get cprAboveCount() {
                return randomInteger(0,30);
            }
        }
    })
  
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
    //console.log("Snapshot: ", snapshot);
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
  