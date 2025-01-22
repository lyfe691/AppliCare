// com.applicare.applicare.model.JobApplication.java

package com.applicare.applicare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

@Data
@Document(collection = "job_applications")
public class JobApplication {

    @Id
    private String id;
    private String userId;
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private String status; 
    private String location;
    private String contactPerson;
    private String contactEmail;
    private String contactPhone;
    private String notes;
    private LocalDateTime appliedDate;
    private LocalDateTime lastUpdated;
    private LocalDateTime nextFollowUp;
    private Double salary;
    private String salaryPeriod;
    private Boolean remote;

    // constructor
    public JobApplication() {
        this.appliedDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

}