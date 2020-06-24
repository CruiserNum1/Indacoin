import React, {Component} from 'react';
import {
    ConvertAmount, ConvertAmountOut, PaymentForm, GetCurrencies, CreateTransaction
} from './constants';
import CurrencyInput from "./components/CurrencyInput/CurrencyInput";
import axios from 'axios';
import './App.css';
// const crypto = require('crypto');

class App extends Component {
    constructor(props) {
        super(props);
        this.state ={
            curIn: '600',
            curOut: '0',
            selectIn: 'USD',
            selectOut: 'BTC',
            email: '',
            walletAddress: '',
            agreement: false,
            currencyList: [],
            countryName: ''
        };
    }

    componentWillMount() {
        axios.get(GetCurrencies,)
            .then(res =>
            {
                this.setState({ currencyList: res.data.result });
            });

        axios.get('https://ipapi.co/json/').then(res => this.setState({ countryName: res.data.country_name }) );
    }

    render() {
        const handleChangeInput = (e) => {
            this.setState({ [e.target.name]: e.target.value });
        }

        const handleCurInput = async (e) => {
            var name = e.target.name;
            const URL = name === 'curIn' ? ConvertAmount : ConvertAmountOut;
            await handleChangeInput(e);
            const convertFrom = this.state.selectIn;
            const convertTo = this.state.selectOut;
            const InputName = name === 'curIn' ? 'curOut' : 'curIn';
            const amount = name === 'curIn' ? this.state.curIn : this.state.curOut;

            await axios.get(URL + `${convertFrom}/${convertTo}/${amount}/Develop_1606`)
                .then(async res => {
                    await this.setState({
                        [InputName]: res.data
                    })
                });
        }

        const handleChangeSelect = async (e) => {
            await handleChangeInput(e);
            const convertFrom = this.state.selectIn;
            const convertTo = this.state.selectOut;
            const amount = this.state.curIn;

            await axios.get(ConvertAmount + `${convertFrom}/${convertTo}/${amount}/Develop_1606`)
                .then(async res => {
                    await this.setState({
                        curOut: res.data
                    })
                });
        }

        const handleButtonClick = () => {
            const partner = 'Develop_1606';
            const cur_from = this.state.selectIn;
            const cur_to = this.state.selectOut;
            const amount = this.state.curIn;
            const address = this.state.walletAddress;
            const user_id = this.state.email;
            
            const url = PaymentForm + 
                `?partner=${partner}&cur_from=${cur_from}&cur_to=${cur_to}&amount=${amount}&address=${address}&user_id=${user_id}`;
            console.log(url);
            window.location.href = url;

            // for POST request (createTransaction -> response transactionId)
            // const target_url = CreateTransaction;
            // const nonce = 1000000;
            // const partnerName = 'Develop_1606';
            // const string = partnerName + '_' + nonce;
            // const secret = 'A1D7b2cCe078755';
            // const sig = crypto.createHmac('sha256', secret).update(string).digest('base64');
            // const arr = {
            //     user_id,
            //     cur_in,
            //     cur_out,
            //     target_address,
            //     amount_in
            // };

            // axios.post(target_url, arr,
            //     {headers: {
            //         "Content-Type": "application/json",
            //         "gw-partner": partnerName,
            //         "gw-nonce": nonce,
            //         "gw-sign": sig
            //     }}
            //     )
            //     .then(res => {
            //         console.log(res);
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });
        };
        
        const disabled = this.state.agreement ? "" : "disabled";
        
        return (
            <div className="card">
                <div className="card-header">
                    <h3>Buy crypto with your credit card in {this.state.countryName}</h3>
                </div>
                <hr />
                <div className="card-body">
                    <div className="convertValues">
                        <CurrencyInput labelName="You have" inputName="curIn" selectName="selectIn" value={this.state.curIn}
                                    currencyList={this.state.currencyList.filter(cur => !cur.withdrawEnabled)}
                                    handleChangeInput={handleCurInput} handleChangeSelect={handleChangeSelect}/>
                        <CurrencyInput labelName="You get" inputName="curOut" selectName="selectOut" value={this.state.curOut}
                                    currencyList={this.state.currencyList.filter(cur => cur.withdrawEnabled)}
                                    handleChangeInput={handleCurInput} handleChangeSelect={handleChangeSelect}/>
                    </div>
                    <div className="address">
                        <input type="email" name="email" placeholder="Email" onChange={handleChangeInput} />
                    </div>
                    <div className="address">
                        <input type="text" name="walletAddress" placeholder="Crypto Wallet Address" onChange={handleChangeInput} />
                    </div>
                    <div className="form-group">
                        <input type="checkbox" name="agreement" onChange={(e) => {this.setState({ agreement: e.target.checked })}} />
                        <label>I agree to the <span style={{ cursor: "pointer", color: "#3464f8" }}>Privacy Policy </span> 
                                and <span style={{ cursor: "pointer", color: "#3464f8" }}>User Agreement</span></label>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button type="button" disabled={disabled} onClick={handleButtonClick}>Continue</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;