import { Component, inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../services/socket';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [NgFor, DatePipe, NgIf , FormsModule, NgClass, TitleCasePipe],
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  trip: any;
  activities: any[] = [];
  days: any[] = [];
  groupedActivities: { [key: string]: any[] } = {};

  showFormForDay: number | null = null;
  editingActivityId: string | null = null;

  message = '';
  isError = false;

  newActivity = {
    title: '',
    description: '',
    date: ''
  };

  editForm = {
    title: '',
    description: '',
    Status: ''
  };


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socketService: SocketService,
  ){}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getTrip(id!);
    //this.getActivities(id!);

    this.socketService.listen('activityCreated', () => {
      console.log('Real-time update');
      this.getActivities(id!);
    });
  }

  getTrip(id: string) {
    if(!isPlatformBrowser(this.platformId)) 
      return;

    const token = localStorage.getItem('token');

    this.http.get(`${environment.apiUrl}/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe ({
      next: (res: any) => {

        console.log("SUCCESS:", res);

        this.trip = res.data.trip;
        this.generateDays();
        this.getActivities(this.trip._id);
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error("ERROR:", err);
        this.cdr.detectChanges();
      }
    });
  }

  generateDays() {

    this.days = [];
    const start =  new Date(this.trip.startDate);
    const end = new Date(this.trip.endDate);

    let current = new Date(start);
    let index = 1;

    while (current <= end) {
      this.days.push({
        day: index,
        date: new Date(current)
      });
      current.setDate(current.getDate() + 1);
      index++;
    }
  }


  openForm(day: any) {
    this.showFormForDay = day.day;
    this.newActivity.date = new Date(day.date).toISOString(); 
  }


  createActivity() {

    if (!this.newActivity.title || !this.newActivity.date) {
      this.message = 'Please fill all required fields';
      this.isError = true;
      return; 
    }

    const token = localStorage.getItem('token');
  
    this.http.post(
      `${environment.apiUrl}/activity/trips/${this.trip._id}/activities`,
      {
        title: this.newActivity.title,
        description: this.newActivity.description,
        date: new Date(this.newActivity.date).toISOString(),
        Status: 'Planned'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.message = 'Activity added successfully!';
        this.isError = false;

        console.log("MESSAGE SET:", this.message);
  
        this.showFormForDay = null;
        this.newActivity = { title: '', description: '', date: '' };
  
        this.getActivities(this.trip._id);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to add activity';
        this.isError = true;
      }
    });
  }

  isSameDay(date1: string, date2: Date) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  getActivities(tripId: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = localStorage.getItem('token');
  
    this.http.get(`${environment.apiUrl}/activity/trips/${tripId}/activities`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        console.log("ACTIVITIES:", res);
        this.activities = res.data.activities;

        this.groupedActivities = {};
        this.activities.forEach(a => {
          const key = new Date(a.date).toDateString();

          if (!this.groupedActivities[key]) {
            this.groupedActivities[key] = [];
          }

          this.groupedActivities[key].push(a);
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error(err)
    });
  }


  editActivity(activity: any) {
    this.editingActivityId = activity._id;
  
    this.editForm = {
      title: activity.title,
      description: activity.description,
      Status: activity.Status
    };
  }

  updateActivity(id: string) {

    console.log("Update clicked", id);
    const token = localStorage.getItem('token');

    console.log("Sending editForm: ", this.editForm);
  
    this.http.put(
      `${environment.apiUrl}/activity/activities/${id}`,
      this.editForm,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (res) => {
        console.log("Update response: ", res);
        this.message = 'Activity updated!';
        this.isError = false;
  
        this.editingActivityId = null;
        this.getActivities(this.trip._id);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to update';
        this.isError = true;
      }
    });
  }

  deleteActivity(id: string) {
  const token = localStorage.getItem('token');

  if (!confirm('Are you sure?')) return;

  this.http.delete(
    `${environment.apiUrl}/activity/activities/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: () => {
      this.message = 'Activity deleted!';
      this.isError = false;

      this.getActivities(this.trip._id);
    },
    error: (err) => {
      console.error(err);
      this.message = 'Failed to delete';
      this.isError = true;
    }
  });
}

}