package com.example.subway.entity;

import com.example.subway.dto.SignUpDto;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "members")
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String memberName;

    @Column(unique = true)
    private String memberEmail;

    @Column
    private String memberPassword;

    @OneToMany(mappedBy = "member")
    private List<FavoriteEntity> favorites = new ArrayList<>();

    public static MemberEntity toMemberEntity(SignUpDto signUpDto) {
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setMemberName(signUpDto.getMemberName());
        memberEntity.setMemberEmail(signUpDto.getMemberEmail());
        memberEntity.setMemberPassword(signUpDto.getMemberPassword());
        return memberEntity;
    }
}
