package com.nt.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
@Entity
@Table(name = "TEAM")
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class Team {

    @Id
    @SequenceGenerator(
        name = "team_gen",
        sequenceName = "seq1",
        allocationSize = 1)
    @GeneratedValue(
        generator = "team_gen",
        strategy = GenerationType.SEQUENCE)
    private Integer teamId;

    @NonNull
    @Column(length = 30)
    private String teamName;

    @NonNull
    @Column(length = 30)
    private String teamOwner;

    @NonNull
    @Column(length = 30)
    private String teamCaptain;

    @Version
    private Integer modifiedCount;

    @CreationTimestamp
    private LocalDateTime createdOn;

    @UpdateTimestamp
    private LocalDateTime updatedOn;

    @Column(length = 30, updatable = false)
    private String createdBy;

    @Column(length = 30)
    private String updatedBy;
}