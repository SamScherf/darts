import { Spinner } from '@blueprintjs/core';
import React from 'react';
import { Average, useRawAverages } from 'src/hooks/useRawAverages';

interface StatsProps {
    password: string;
}
export const Stats: React.FC<StatsProps> = ({ password }) => {
    const {isLoading, data: rawAverages} = useRawAverages(password);

    return isLoading || rawAverages == null
            ? <Spinner />
            : <div>{rawAverages.map(rawAverage => <AverageTag rawAverage={rawAverage} key={rawAverage.user} />)}</div>
}

interface AverageTagProps {
    rawAverage: Average;
}
export const AverageTag: React.FC<AverageTagProps> = ({ rawAverage }) => {
    return (
        <div>
            {rawAverage.user}: {rawAverage.averageScore}
        </div>
    )
}