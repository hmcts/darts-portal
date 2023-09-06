<<<<<<< HEAD
import { Component, Input, OnInit } from '@angular/core';
=======
import { Component, Input } from '@angular/core';
>>>>>>> master
import { CommonModule } from '@angular/common';
import { CaseFile } from 'src/app/types/case-file';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent {
  @Input() public caseFile!: CaseFile;
}
