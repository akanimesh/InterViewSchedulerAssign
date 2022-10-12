from datetime import datetime
from scheduler.models import Meet


def time_to_minutes(time):
    time = time.strftime("%H:%M").split(':')
    return int(time[0])*60+(int(time[1]))

def minutes_to_time(total_minutes):
    hour = str(total_minutes//60) 
    minutes =  str(total_minutes%60)
    time = ""
    if(hour == '24'):
        time = "23:59:59"
    else:
        time = hour+':'+minutes+':00'
    
    return datetime.strptime(time,'%H:%M:%S').time()
    # print(timedelta(minutes=minutes), 15)
    # return timedelta(minutes=minutes)

def find_common_intervals(arr1, arr2):
    i = j = 0
    n = len(arr1)
    m = len(arr2)
    common_intervals = []

    while i < n and j < m:
        l = max(arr1[i][0], arr2[j][0]) 
        r = min(arr1[i][1], arr2[j][1])
        if l <= r:
            common_intervals.append([l,r])
 
        if arr1[i][1] < arr2[j][1]:
            i += 1
        else:
            j += 1
        
    return common_intervals



def get_available_prev_time_slots(day, participants):
    gap = 1 #min gap between 2 meetings
    participants_available_time_slots=[]
    n = len(participants)
    for participant in participants:
        meet_slots = Meet.objects.filter(day=day, participants__id=participant).values_list('start_time','end_time')
        available_slots = []
        last_start, last_end = 0, 1440
        for start,end in meet_slots:
            # print(type(start))
            start = time_to_minutes(start)
            end = time_to_minutes(end)
            if(start-last_start > gap):
                available_slots += [(last_start, start-gap)]
            last_start = end+gap
        if(last_end-last_start > gap):
                available_slots += [(last_start, last_end)]
        participants_available_time_slots += [available_slots]

    print(participants_available_time_slots, '58')
    print()
    prev_time_slots=participants_available_time_slots[0]
    for i in range(1, n-1):
        prev_time_slots = find_common_intervals(prev_time_slots, participants_available_time_slots[i])

    return prev_time_slots


def get_available_time_slots(day, participants):
    prev_time_slots = get_available_prev_time_slots(day, participants)
    common_slots = []
    for slot in prev_time_slots:
        common_slots.append(
            {
                'start_time':minutes_to_time(slot[0]), 
                'end_time': minutes_to_time(slot[1])
            }
        )
    return common_slots