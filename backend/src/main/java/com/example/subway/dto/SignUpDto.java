package com.example.subway.dto;

import com.example.subway.entity.MemberEntity;
import lombok.Data;

@Data
public class SignUpDto {

    private String memberName;
    private String memberEmail;
    private String memberPassword;

    public static SignUpDto toSignUpDto(MemberEntity memberEntity) {
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setMemberName(memberEntity.getMemberName());
        signUpDto.setMemberEmail(memberEntity.getMemberEmail());
        signUpDto.setMemberPassword(memberEntity.getMemberPassword());
        return signUpDto;
    }
}
