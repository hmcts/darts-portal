import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from 'express';
import { CaseService } from 'src/app/services/case/case.service';
import { CaseData } from 'src/app/types/case';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseFile } from 'src/app/types/case-file';

@Component({
  selector: 'app-case-file',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})
export class CaseFileComponent implements OnInit {
  public caseId!: string;
  public caseFile!: CaseFile;

  constructor(private route: ActivatedRoute, private caseService: CaseService) {}

  getCaseFile(): void {
    this.caseId = this.route.snapshot.params.caseId;
    this.caseService.getCaseFile(this.caseId).subscribe({
      next: (result: CaseFile) => {
        console.log(result);
        this.caseFile = result;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.type);
      },
    });
  }

  ngOnInit(): void {
    this.getCaseFile();
  }
}
