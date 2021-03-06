import React from 'react';
import $ from 'jquery';

import Datepicker from '../elements/Datepicker.jsx';
import Dropdown from '../elements/Dropdown.jsx';
import TextInput from '../elements/TextInput.jsx';
import {getNewDateDes, checkNeedExtraVisa, getExtraVisaDes} from '../services/functions.js';

class BusinessForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            business: {},
            subServices: [],
            progresses: [],
            commissionProgresses: [],
            employees: [],
            employeesMaterial: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getProgresses = this.getProgresses.bind(this);
        this.getSubServices = this.getSubServices.bind(this);
        
    }
    componentWillReceiveProps(nextProps) {
        const business = nextProps.business;
        this.getSubServices(business.service_id);
        this.getProgresses(business.service_id);
        this.setState({
            business: business
        });
    }
    componentDidMount() {
        const _this = this;
        $.ajax({
            url: '/admin/controllers/service.php?action=getPaidServices',
            success(res) {
                _this.setState({
                    services: res
                });
            }
        });
        $.ajax({
            url: '/admin/controllers/commissionProgress.php?action=getCommissionProgress',
            data: {type: 'free'},
            success(res) {
                _this.setState({
                    commissionProgresses: res
                });
            }
        });
        $.ajax({
            url: '/admin/controllers/employee.php?action=getEmployees',
            data: {type: 'free'},
            success(res) {
                _this.setState({
                    employees: res
                });
            }
        });
        $.ajax({
            url: '/admin/controllers/employee.php?action=getEmployeesMaterial',
            data: {type: 'free'},
            success(res) {
                _this.setState({
                    employeesMaterial: res
                });
            }
        });
    }
    handleChange(e) {
        const p = e.target.name;
        const v = e.target.value;
        var b = this.state.business;
        b[p] = v;
        this.setState({
            business: b
        });
        if (p == 'service_id') {
            this.getSubServices(v);
            this.getProgresses(v);
        }
    }
    getSubServices(id) {
        const _this = this;
        $.ajax({
            url: '/admin/controllers/service.php?action=getSubServices',
            data: {id: id},
            success(res) {
                _this.setState({
                    subServices: res
                });
            }
        });
    }
    getProgresses(id) {
        const _this = this;
        $.ajax({
            url: '/admin/controllers/progress.php?action=getProgresses',
            data: {id: id},
            success(res) {
                _this.setState({
                    progresses: res
                });
            }
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const _this = this;
        $.ajax({
            url: '/admin/controllers/business.php?action=upsertBusiness',
            method: 'POST',
            data: _this.state.business,
            success(res) {
                _this.props.refreshPage();
            }
        });
    }
    render() {
        const business = this.state.business;
        const services = this.state.services.map((s) =>
            <option key={s.id} value={s.id}>{s.name}</option>
        );
        const subServices = this.state.subServices.map((s) =>
            <option key={s.id} value={s.id}>{s.name}</option>
        );
        const progresses = this.state.progresses.map((p) =>
            <option key={p.id} value={p.id}>{p.name}</option>
        );
        const commissionProgresses = this.state.commissionProgresses.map((c) =>
            <option key={c.id} value={c.id}>{c.name}</option>
        );
        const employees = this.state.employees.map((c) =>
            <option key={c.id} value={c.id}>{c.name}</option>
        );
        const employeesMaterial = this.state.employeesMaterial.map((c) =>
            <option key={c.id} value={c.id}>{c.name}</option>
        );
        return (
            <form className="columns is-multiline" autoComplete="off" onSubmit={this.handleSubmit}>
                <div className="column is-2">
                    <Dropdown title={'服务'} name={'service_id'} value={business.service_id} handleChange={this.handleChange} options={services} />
                    <Dropdown title={'副服务'} name={'sub_service_id'} value={business.sub_service_id} handleChange={this.handleChange} options={subServices} />
                </div>
                <div className="column is-2">
                    {(business.service_id == '7') ?
                    <TextInput title={'政府费'} name={'government_fee'} value={business.government_fee} handleChange={this.handleChange} />
                    :
                    <TextInput title={'申请费'} name={'application_fee'} value={business.application_fee} handleChange={this.handleChange} />
                    }
                    <TextInput title={'服务费'} name={'service_fee'} value={business.service_fee} handleChange={this.handleChange} />
                    {['4', '10', '11'].indexOf(business.service_id) == -1 ?
                    <TextInput title={'邮寄费'} name={'post_fee'} value={business.post_fee} handleChange={this.handleChange} />
                    :null}
                </div>
                <div className={checkNeedExtraVisa(business.sub_service_id)}>
                    <div className="field">
                        <label className="label">递交时间</label>
                        <div className="control">
                            <Datepicker name={"extra_submit_date"} value={business.extra_submit_date} handleChange={this.handleChange} />
                        </div>
                    </div>
                    <Dropdown title={'进度'} name={'extra_progress_id'} value={business.extra_progress_id} handleChange={this.handleChange} options={progresses} />

                    <div className="field">
                        <label className="label">{getExtraVisaDes(business.sub_service_id)}</label>
                        <div className="control">
                            <Datepicker name={"extra_new_date"} value={business.extra_new_date} handleChange={this.handleChange} />
                        </div>
                    </div>
                </div>
                <div className="column is-2">
                    <div className="field">
                        <label className="label">递交时间</label>
                        <div className="control">
                            <Datepicker name={"submit_date"} value={business.submit_date} handleChange={this.handleChange} />
                        </div>
                    </div>
                    <Dropdown title={'进度'} name={'progress_id'} value={business.progress_id} handleChange={this.handleChange} options={progresses} />
                    <div className="field">
                        <label className="label">{business.sub_service_id != '0' ? getNewDateDes(business.sub_service_id) : getNewDateDes(business.service_id)}</label>
                        <div className="control">
                            <Datepicker name={"new_date"} value={business.new_date} handleChange={this.handleChange} />
                        </div>
                    </div>
                </div>
                <div className="column is-2">
                    <Dropdown title={'责任服务'} name={'employee_id'} value={business.employee_id} handleChange={this.handleChange} options={employees} />
                    <Dropdown title={'责任文案'} name={'employee_material_id'} value={business.employee_material_id} handleChange={this.handleChange} options={employeesMaterial} />
                </div>
                <div className="column">
                    <TextInput title={'备注'} name={'remark'} value={business.remark} handleChange={this.handleChange} />
                </div>
                <div className="field column">
                    <button className="button is-primary">Submit</button>
                </div>
            </form>
        );
    }
}

export default BusinessForm;