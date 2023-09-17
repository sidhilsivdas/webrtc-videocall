import * as Constants from '../config/constants';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import LoaderDiv from "../elements/LoaderDiv";
import { useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';


export default function RequestContainer(props) {

    let initialFormData = {
        stock_id: "",
        quantity: {...props.data.item}.id,
        price: 0
    }

    console.log(props.data.item.id);
    const [formData, setFormData] = useState({...initialFormData});
    const [errorData, setErrorData] = useState({});
    const [isLoading, setIsLoading] = useState(false);



    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }



    return (
        


            <tr key={`req-cont-tr-${props.data.item.id}`}>
                <td>
                   {props.data.item.id} 
                </td>
                <td className='request-cont-td'>
                <input name="quantity" value={formData.quantity} onChange={handleInputChange} type="number" className={"form-control " + (errorData.quantity ? 'is-invalid' : '')} />
                </td>

                <td className='request-cont-td'>
                    <input name="price" value={formData.price} onChange={handleInputChange} type="number" className={"form-control " + (errorData.price ? 'is-invalid' : '')} />
                </td>

            </tr>

        
    )
}