package com.example.subway.dto;

import com.example.subway.entity.MemberEntity;
import lombok.*;

@Data
public class MemberDto {

    private String memberEmail;
    private String memberPassword;

    public static MemberDto toMemberDTO(MemberEntity memberEntity) {
        MemberDto memberDTO = new MemberDto();
        memberDTO.setMemberEmail(memberEntity.getMemberEmail());
        memberDTO.setMemberPassword(memberEntity.getMemberPassword());
        return memberDTO;
    }
}
