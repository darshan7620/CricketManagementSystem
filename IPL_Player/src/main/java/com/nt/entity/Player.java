package com.nt.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
@Entity
@Table(name = "PLAYER")
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class Player {

    @Id
    @SequenceGenerator(
        name = "player_gen",
        sequenceName = "SEQ2",
        initialValue = 1111,
        allocationSize = 1)
    @GeneratedValue(
        generator = "player_gen",
        strategy = GenerationType.SEQUENCE)
    private Integer playerId;

    @NonNull
    @Column(length = 30)
    private String playerName;

    @NonNull
    @Column(length = 30)
    private String playerRole;

    @NonNull
    private Integer jerseyNo;

    @NonNull
    private Integer age;

    @ManyToOne(targetEntity = Team.class, 
    		fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "teamId",name="teamId")
    private Team team;

    @Version
    private Integer modifiedCount;

    @CreationTimestamp
    private LocalDateTime createdOn;

    @UpdateTimestamp
    private LocalDateTime updatedOn;

    @NonNull
    @Column(length = 30)
    private String createdBy;

    @NonNull
    @Column(length = 30)
    private String updatedBy;
}