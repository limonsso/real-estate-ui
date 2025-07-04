import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
    selector: 'app-comments',
    imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        FlexLayoutModule
    ],
    templateUrl: './comments.component.html'
})
export class CommentsComponent implements OnInit {
  @Input('propertyId') propertyId: number;
  public commentForm: FormGroup;
  public reviews = [
    {
      author: 'Bruno Vespa',
      avatar: 'images/avatars/avatar-1.png',
      tooltip: 'Dissatisfied',
      icon: 'sentiment_dissatisfied',
      date: '13 January, 2018 at 7:09',
      text: 'Integer id eros et mi fringilla imperdiet. In dictum turpis eget magna viverra condimentum. Ut malesuada interdum ultrices. Proin tristique sem pellentesque, posuere dui in, maximus magna. Aenean vehicula, tortor gravida elementum tincidunt, justo lorem vestibulum ex, eget egestas arcu tellus in magna.'
    },
    {
      author: 'Julia Aniston',
      avatar: 'images/avatars/avatar-2.png',
      tooltip: 'Very Satisfied',
      icon: 'sentiment_very_satisfied',
      date: '04 February, 2018 at 10:22',
      text: 'Nulla accumsan, lacus sed suscipit rutrum, turpis augue accumsan metus, in accumsan urna mi vehicula lorem. Pellentesque semper nibh vitae augue placerat finibus. Nulla sed porttitor nunc, quis tristique sem. Quisque in varius nisl. Integer turpis lorem, ultricies sed sem nec, commodo molestie arcu. Nulla finibus ex tortor, et suscipit magna semper consectetur. Cras sit amet metus dui. Maecenas eget dui at ex varius malesuada vel non felis.'
    },
    {
      author: 'Andy Warhol',
      avatar: 'images/avatars/avatar-3.png',
      tooltip: 'Neutral',
      icon: 'sentiment_neutral',
      date: '14 February, 2018 at 11:10',
      text: 'Pellentesque hendrerit vel turpis aliquam placerat. Suspendisse ullamcorper congue feugiat. Etiam gravida metus ac massa posuere venenatis. Pellentesque vehicula lobortis dolor, ac pretium dolor maximus quis. Fusce vitae iaculis mauris, quis posuere ex. Mauris vitae convallis nibh. Etiam eget enim at orci interdum maximus nec in ante.'
    }
  ];
  public ratings = [
    { title: 'Very Dissatisfied', icon: 'sentiment_very_dissatisfied', percentage: 20, selected: false },
    { title: 'Dissatisfied', icon: 'sentiment_dissatisfied', percentage: 40, selected: false },
    { title: 'Neutral', icon: 'sentiment_neutral', percentage: 60, selected: false },
    { title: 'Satisfied', icon: 'sentiment_satisfied', percentage: 80, selected: false },
    { title: 'Very Satisfied', icon: 'sentiment_very_satisfied', percentage: 100, selected: false }
  ];
  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.commentForm = this.fb.group({
      review: [null, Validators.required],
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      email: [null, Validators.compose([Validators.required, emailValidator])],
      rate: null,
      propertyId: this.propertyId
    });
  }

  public onCommentFormSubmit(values: any) {
    if (this.commentForm.valid) {
      console.log(values);
      if (values.rate) {
        //property.ratingsCount++,
        //property.ratingsValue = property.ratingsValue + values.rate,
      }
    }
  }

  public rate(rating: any) {
    this.ratings.filter(r => r.selected = false);
    this.ratings.filter(r => r.percentage == rating.percentage)[0].selected = true;
    this.commentForm.controls.rate.setValue(rating.percentage);
  }

}