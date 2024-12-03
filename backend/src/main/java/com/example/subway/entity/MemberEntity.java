package com.example.subway.entity;

<<<<<<< HEAD
import com.example.subway.dto.LoginDto;
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
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
