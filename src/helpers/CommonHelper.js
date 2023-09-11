class CommonHelper{
    static isEmptyValue = (value) => {
       if(typeof value == undefined || value == ""){
           return true;
       }
       return false;
    }

    static downloadFile = (url) =>{
        window.open(url, '_blank');
    }
}
export default CommonHelper;