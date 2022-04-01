
export function splitTime(totalSeconds)
{
    var seconds, totalMinutes, minutes, hours;

    totalMinutes = Math.floor(totalSeconds / 60);

    seconds = Math.floor(totalSeconds % 60);
    minutes = Math.floor(totalMinutes % 60);
    hours = Math.floor(totalMinutes / 60);


    return { hours, minutes, seconds };
}

export function formatSecondsIntoTime(totalSeconds)
{
    var { hours, minutes, seconds } = splitTime(totalSeconds);

    hours = hours.toString();
    minutes = minutes.toString();
    seconds = seconds.toString();

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}