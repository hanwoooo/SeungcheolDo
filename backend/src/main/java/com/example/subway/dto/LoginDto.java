package com.example.subway.dto;

import com.example.subway.entity.MemberEntity;
import lombok.*;

@Data
public class LoginDto {

    private String memberEmail;
    private String memberPassword;

    public static LoginDto toMemberDTO(MemberEntity memberEntity) {
        LoginDto loginDTO = new LoginDto();
        loginDTO.setMemberEmail(memberEntity.getMemberEmail());
        loginDTO.setMemberPassword(memberEntity.getMemberPassword());
        return loginDTO;
    }
}
