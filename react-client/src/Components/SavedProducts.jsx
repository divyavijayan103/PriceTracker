import React, { Component } from 'react';

const SavedProducts = ({savedProductdata}) =>{

    let parsedData = savedProductdata;
    try{
    if(typeof savedProductdata ==="string")
        parsedData= JSON.parse(savedProductdata);
    }catch(e){

    }
    const productData=parsedData && parsedData.products;
    const items=[];
    if(productData && typeof productData.entries==="function"){
        for (const [index, value] of productData.entries()) {
            items.push(
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{value.productTitle}</td>
                    {/* <td>{value.originalPrice===''? (value.salesPrice===''?(value.dealPrice===''?value.amazonPrice:value.dealPrice):value.salesPrice):value.originalPrice}</td> */}
                    <td>
                        <span>Sale price:{value.salesPrice}</span>
                        <span>Deal price:{value.dealPrice}</span>
                        <span>Amazon price:{value.amazonPrice}</span>
                    </td>
                    <td>
                        <span>Sale price:{value.currentPrice?value.currentPrice.salesPrice:'Same'}</span>
                        <span>Deal price:{value.currentPrice?value.currentPrice.dealPrice:'Same'}</span>
                        <span>Amazon price:{value.currentPrice?value.currentPrice.amazonPrice:'Same'}</span>
                    </td>
                    <td><a href={value.url} target="_blank">Amazon Link</a></td>
                </tr>
            )
        }
    }
    return(
        <div>
            <h2>
                Saved Items
            </h2>
            <table className="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Product Name</th>
                <th scope="col">Saved Prices</th>
                <th scope="col">Today's Price</th>
                <th scope="col">Amazon Site Link</th>
                </tr>
            </thead>
            <tbody>
            {items}
            </tbody>
            </table>
        </div>
        
    )
}
export default SavedProducts;