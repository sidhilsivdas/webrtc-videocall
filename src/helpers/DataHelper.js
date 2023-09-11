import * as Constants from '../config/constants';
class DataHelper {
    getFetchHeaders(){
        const token = localStorage.getItem('token');
        const options = {
            headers: new Headers({ 'api-token': token }),
        };
        return options
    }
    // Simple function
     async test() {
        // const fish = await fetch(this.fishApiUrl).then(response => response.json());
    
        // const fishIds = fish.map(fish => fish.id),
        // chipReqOpts = { method: 'POST', body: JSON.stringify({ fishIds }) };
    
        // const chips = await fetch(this.chipsApiUrl, chipReqOpts).then(response => response.json());
        const projects = await fetch(`${Constants.API_URL}/projects/all`, this.getFetchHeaders());
        return projects.json();
    }
    
}
export default DataHelper;