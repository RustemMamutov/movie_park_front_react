import React, {Component} from 'react';

interface IProps {
    setActiveDate: Function
    activeDateList: string[]
}


export class CalendarMenuClass extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    getListOfElements = () => {
        const dates: any[] = []
        this.props.activeDateList.forEach(date => {
            dates.push(<div>
                <button className='btn btn-success menu-item'
                        onClick={() => this.props.setActiveDate(date)}>
                    {date}
                </button>
            </div>)
        })
        return dates
    }

    render() {
        const dates = this.getListOfElements()
        return (
            <div>
                {dates}
            </div>
        )
    }
}

export default function CalendarMenu(props: any) {
    return <CalendarMenuClass setActiveDate={props.setActiveDate}
                              activeDateList={props.activeDateList}/>
}