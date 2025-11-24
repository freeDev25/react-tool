import React from 'react';import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import GridWrapper from '../GridWrapper/GridWrapper';
import StatCard from '../StatCard/StatCard';
import './style.css';

interface ComplexDashboardProps {
    userName?: string;
}

const ComplexDashboard: React.FC<ComplexDashboardProps> = (props) => {
    return (
        <div className="generated-0">
            <DashboardSidebar userName={props.userName}/>
            <div className="generated-1">
                <DashboardHeader userName={props.userName}/>
                <main className="generated-2">
                    <GridWrapper>
                        <span>
                            <div className="generated-3">
                                <StatCard title="Total Users" value="1,234" trend="up"/>
                                <StatCard title="Revenue" value="$45,678" trend="up"/>
                                <StatCard title="Bounce Rate" value="23%" trend="down"/>
                            </div>
                        </span>
                    </GridWrapper>
                    <div className="generated-4">
                        <h3>
                            Recent Activity
                        </h3>
                        <p>
                            No recent activity to show.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ComplexDashboard;