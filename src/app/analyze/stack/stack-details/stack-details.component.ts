import { Stack } from './../../../models/stack';
import { ComponentAnalysesService } from './../component-analyses.service';
import { Component, OnInit, Input } from '@angular/core';

import { StackAnalysesService } from '../stack-analyses.service';
import { StackAnalysesModel } from '../stack-analyses.model';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'stack-details',
  templateUrl: './stack-details.component.html',
  styleUrls: ['./stack-details.component.css'],
  providers: [StackAnalysesService, StackAnalysesModel, ComponentAnalysesService]
})
export class StackDetailsComponent implements OnInit {

  @Input() stack: Stack;

  errorMessage: string;
  stackAnalysesData: {};
  componentAnalysesData: {};
  mode = 'Observable';
  averageUsage = '';
  lowPublicUsageComponents = '';
  redhatDistributedComponents = '';

  averageStars = '';
  averageForks = '';
  lowPopularityComponents = '';

  distinctLicenses = '';
  totalLicenses = '';

  totalSecurityIssues = '';
  cvss = '';

  componentsWithTests = '';
  componentsWithDependencyLockFile = '';
  requiredEngines = {};
  requiredEnginesArr = [];

  componentDataObject = {};
  componentsDataTable = [];

  constructor(
    private stackAnalysesService: StackAnalysesService,
    private stackAnalysesModel: StackAnalysesModel,
    private renderComponentService: ComponentAnalysesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getStackAnalyses(this.stack.uuid);
  }

  private getStackAnalyses(id: string) {
    this.stackAnalysesService.getStackAnalyses(id)
      .subscribe(
      stackAnalysesData => {
        this.stackAnalysesData = stackAnalysesData;
        this.averageUsage = this.stackAnalysesData[0].usage.average_usage;
        this.lowPublicUsageComponents = this.stackAnalysesData[0].usage.low_public_usage_components;
        this.redhatDistributedComponents = this.stackAnalysesData[0].usage.redhat_distributed_components;

        this.averageStars = this.stackAnalysesData[0].popularity.average_stars;
        this.averageForks = this.stackAnalysesData[0].popularity.average_forks;
        this.lowPopularityComponents = this.stackAnalysesData[0].popularity.low_popularity_components;

        this.distinctLicenses = this.stackAnalysesData[0].distinct_licenses;
        this.totalLicenses = this.stackAnalysesData[0].total_licenses;

        this.totalSecurityIssues = this.stackAnalysesData[0].total_security_issues;
        this.cvss = this.stackAnalysesData[0].cvss;

        this.componentsWithTests = this.stackAnalysesData[0].metadata.components_with_tests;
        this.componentsWithDependencyLockFile = this.stackAnalysesData[0].metadata.components_with_dependency_lock_file;
        this.requiredEngines = this.stackAnalysesData[0].metadata.required_engines;
        for (let key in this.requiredEngines) {
          if (this.requiredEngines.hasOwnProperty(key)) {
            this.requiredEnginesArr.push({ key: key, value: this.requiredEngines[key] });
          }
        }

        for (let i = 0; i < this.stackAnalysesData[0].components.length; i++) {
          let myObj = Object.assign({}, this.stackAnalysesModel);
          myObj.ecosystem = this.stackAnalysesData[0].components[i].ecosystem;
          myObj.pkg = this.stackAnalysesData[0].components[i].name;
          myObj.version = this.stackAnalysesData[0].components[i].version;
          myObj.latestVersion = this.stackAnalysesData[0].components[i].latest_version;
          myObj.publicUsage = this.stackAnalysesData[0].components[i].dependents_count;
          myObj.relativePublicUsage = this.stackAnalysesData[0].components[i].relative_usage;
          if (this.stackAnalysesData[0].components[i].github_details.forks_count) {
            myObj.popularity = this.stackAnalysesData[0].components[i].github_details.forks_count + "/" + this.stackAnalysesData[0].components[i].github_details.stargazers_count;
          } else {
            myObj.popularity = '';
          }

          myObj.redhatUsage = '';
          myObj.licence = this.stackAnalysesData[0].components[i].licenses[0];
          this.componentsDataTable.push(myObj);
        }

      },
      error => this.errorMessage = <any>error
      );
  }

  private getComponentAnalyses(item) {
    this.renderComponentService.getComponentAnalyses(item)
      .subscribe(
      componentAnalysesData => {
        this.componentAnalysesData = componentAnalysesData;
      },
      error => this.errorMessage = <any>error
      );
  }

}
