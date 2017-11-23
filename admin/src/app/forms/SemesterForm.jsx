import React, {Component} from 'react';
import $ from 'jquery';

import Dropdown from '../elements/Dropdown.jsx';
import Datepicker from '../elements/Datepicker.jsx';
import TextInput from '../elements/TextInput.jsx';

import Api from '../services/api.js';
const api = new Api();

class SemesterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            performanceId: props.performanceId,
            semester: null,
            semesterOptions: [
                'ESL 1',
                'ESL 2',
                'ESL 3',
                'ESL 4',
                'ESL 5',
                'ESL 6',
                '1st semester',
                '2nd semester',
                '3rd semester'
            ],
            semesters: []
        };
        this.getNewSemester = this.getNewSemester.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.upsert = this.upsert.bind(this);
        this.getSemesters = this.getSemesters.bind(this);
        this.edit = this.edit.bind(this);
    }
    componentWillMount() {
        this.setState({
            semester: this.getNewSemester()
        });
        this.getSemesters();
    }
    getSemesters() {
        const _this = this;
        $.ajax({
            url: api.getSemesters(),
            data: {id: _this.state.performanceId},
            success(res) {
                _this.setState({
                    semesters: res
                });
            }
        });
    }
    componentDidMount() {
        this.getSemesters();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            performanceId: nextProps.performanceId
        });
        this.getSemesters();
    }
    handleChange(e) {
        const p = e.target.name;
        const v = e.target.value;
        let semester = this.state.semester;
        semester[p] = v;
        this.setState({
            semester
        });
    }
    getNewSemester() {
        return {
            id: 0,
            performance_id: this.props.performanceId,
            semester: '',
            school_start_date: '',
            fee: '',
            progress_id: '',
            commission_progress_id: '',
            employee_id: '',
            employee_material_id: '',
            remark: ''
        };
    }
    edit(semester) {
        var s = this.getNewSemester();
        Object.keys(s).map((key) =>
            s[key] = semester[key]
        );
        this.setState({
            semester: s
        });
    }
    upsert() {
        const _this = this;
        $.ajax({
            url: api.getUpsertSemester(),
            method: 'POST',
            data: _this.state.semester,
            success(res) {
                _this.getSemesters();
                _this.setState({
                    semester: _this.getNewSemester()
                });
            }
        });
    }
    render() {
        const _this = this;
        const {semester, semesterOptions, semesters} = this.state;
        const {progresses, commissionProgresses, employees, employeesMaterial} = this.props;
        const options = semesterOptions.map((s) => 
            <option key={s} value={s}>{s}</option>
        );
        const list = semesters.map((s) => 
            <div key={s.id} className="columns">
                <div className="column">
                    <p>学期: {s.semester}</p>
                    <p>开学日期: {s.school_start_date}</p>
                </div>
                <div className="column">
                    学费: {s.fee}<br/>
                    进度: {s.progress_name}<br/>
                    佣金申报: {s.commission_progress_name}
                </div>
                <div className="column">
                    备注: {s.remark}
                </div>
                <div className="column">
                    责任客服: {s.employee_name}<br/>
                    责任文案: {s.employee_material_name}
                </div>
                <div className="column">
                    修改日期: {s.updated_at}<br/>
                    最后修改: {s.last_modified_name}
                </div>
                <div className="column">
                    <a className="button is-warning" onClick={_this.edit.bind(_this, s)}>修改</a>
                </div>
            </div>
        );
        return (
            <div className="card">
                {list}
                <a className="button is-primary" onClick={this.upsert}>添加学期</a>
                <div className="columns">
                    <div className="column">
                        <Dropdown title={'Semester'} name={'semester'} value={semester.semester} handleChange={this.handleChange} options={options}  />
                    </div>
                    <div className="field column">
                        <label className="label">开学日期</label>
                        <div className="control">
                            <Datepicker name={"school_start_date"} value={semester.school_start_date} handleChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="column">
                        <TextInput title={"学费"} name={"fee"} value={semester.fee} handleChange={this.handleChange} />
                    </div>
                    <div className="column">
                        <Dropdown title={'进度'} name={'progress_id'} value={semester.progress_id} handleChange={this.handleChange} options={progresses}  />
                    </div>
                    {semester.progress_id == '32' ?
                    <div className="column">
                        <Dropdown title={'佣金申报'} name={'commission_progress_id'} value={semester.commission_progress_id} handleChange={this.handleChange} options={commissionProgresses}  />
                    </div>
                    :null}
                    <div className="column">
                        <TextInput title={"备注"} name={"remark"} value={semester.remark} handleChange={this.handleChange} />
                    </div>
                    <div className="column">
                        <Dropdown title={'责任客服'} name={'employee_id'} value={semester.employee_id} handleChange={this.handleChange} options={employees}  />
                    </div>
                    <div className="column">
                        <Dropdown title={'责任文案'} name={'employee_material_id'} value={semester.employee_material_id} handleChange={this.handleChange} options={employeesMaterial}  />
                    </div>
                </div>
            </div>
        );
    }
}

export default SemesterForm;