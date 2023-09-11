import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import * as Constants from '../config/constants';

export default class MultiSkillSelect extends Component {
    state = {
        inputValue:"",
        selectedValue: this.props.defaultValues,
        defaultValues : [],
        error : false
    };

    // handle input change event
    handleInputChange = value => {
        //setValue(value);
        this.setState({ inputValue: value });
    };

    // handle selection
    handleChange = value => {
        //setSelectedValue(value);
        this.setState({ selectedValue: value });
        this.props.sendSkills(value);
    }

    // load options using API call
    loadOptions = (inputValue) => {
        const token = localStorage.getItem('token');
        const options = {
            headers: new Headers({'api-token': token}),
        };
        const data = fetch(`${Constants.API_URL}/skills/search?q=${inputValue}`,options).then(res => res.json());
        console.log(data);
        return data;
    };

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps.defaultValues);
        if (this.props !== nextProps) {
          this.setState({ selectedValue: nextProps.defaultValues,error:nextProps.error });
        }
    }

    

    
    render() {
        const borderColor = this.state.error ? "#dc3545 !important" : "#ced4da !important";
        const customStyles = {
                      
            control: base => ({
                ...base,
                "borderColor": borderColor
              })
          
            
          }
        
        var {inputValue,selectedValue, defaultValues} = this.state;
        //console.log("hey",selectedValue);
        return (
            <div className="">
                <AsyncSelect
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={customStyles}
                    isMulti
                    placeholder = "Search Skills"
                    //cacheOptions
                    //defaultOptions
                    value={selectedValue}
                    getOptionLabel={e => e.skill_name}
                    getOptionValue={e => e.skill_id}
                    loadOptions={this.loadOptions}
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChange}
                    
                />
                
            </div>
        );
    }
}

