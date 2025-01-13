// com.applicare.applicare.model.Task.java

package com.applicare.applicare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

@Data
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;

    private String title;

    private String description;

    private LocalDate deadline;

    private boolean completed;

    private String priority; // HIGH, MEDIUM, LOW

    private String userId;

    private String applicationId;

    private LocalDate createdAt;

    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
    }
}